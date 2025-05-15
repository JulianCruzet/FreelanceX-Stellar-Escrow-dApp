#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, Vec, Symbol, String,
    token::{self, Client as TokenClient},
};

mod types;
mod errors;
mod events;

#[cfg(test)]
mod test;

use types::{Job, Milestone, JobStatus, MilestoneStatus};
use errors::EscrowError;
use events::{emit_job_created, emit_funds_deposited, emit_milestone_paid, emit_dispute_initiated, emit_job_cancelled};

#[contract]
pub struct FreelanceXEscrow;

#[contractimpl]
impl FreelanceXEscrow {
    /// Initialize a new job with milestones
    pub fn create_job(
        env: &Env,
        client: Address,
        budget: i128,
        milestones: Vec<Milestone>,
    ) -> Result<u64, EscrowError> {
        // Validate milestones
        if milestones.is_empty() {
            return Err(EscrowError::NoMilestones);
        }

        // Calculate total percentage
        let total_percentage: u32 = milestones.iter()
            .map(|m| m.percentage)
            .sum();
        
        if total_percentage != 100 {
            return Err(EscrowError::InvalidMilestonePercentages);
        }

        // Validate milestone dates
        Self::validate_milestone_dates(env, &milestones)?;

        // Generate job ID
        let job_id = env.storage().instance().get(&symbol_short!("job_count"))
            .unwrap_or(0) + 1;
        env.storage().instance().set(&symbol_short!("job_count"), &job_id);

        // Assign milestone IDs and create job
        let mut milestones_with_ids = Vec::new(env);
        for (i, mut milestone) in milestones.iter().enumerate() {
            milestone.id = (i + 1) as u64;
            milestones_with_ids.push_back(milestone);
        }

        let job = Job {
            id: job_id,
            client: client.clone(),
            freelancer: None,
            budget,
            status: JobStatus::Open,
            milestones: milestones_with_ids,
        };

        // Store job with tuple key
        env.storage().instance().set(&(symbol_short!("job"), job_id), &job);

        // Emit event
        emit_job_created(env, job_id, client);

        Ok(job_id)
    }

    /// Accept a job as a freelancer
    pub fn accept_job(env: &Env, _invoker: Address, job_id: u64, freelancer: Address) -> Result<(), EscrowError> {
        let key = (symbol_short!("job"), job_id);
        let mut job: Job = env.storage().instance().get(&key)
            .ok_or(EscrowError::JobNotFound)?;

        if job.status != JobStatus::Open {
            return Err(EscrowError::JobNotOpen);
        }

        job.freelancer = Some(freelancer.clone());
        job.status = JobStatus::InProgress;

        env.storage().instance().set(&key, &job);
        Ok(())
    }

    /// Initialize the contract with USDC token address
    pub fn initialize(env: &Env, usdc_token: Address) -> Result<(), EscrowError> {
        if env.storage().instance().has(&symbol_short!("usdc_tkn")) {
            return Err(EscrowError::AlreadyInitialized);
        }
        env.storage().instance().set(&symbol_short!("usdc_tkn"), &usdc_token);
        Ok(())
    }

    /// Get the USDC token address
    pub fn get_usdc_token(env: &Env) -> Result<Address, EscrowError> {
        env.storage().instance().get(&symbol_short!("usdc_tkn"))
            .ok_or(EscrowError::NotInitialized)
    }

    /// Deposit funds into escrow
    pub fn deposit_funds(env: &Env, invoker: Address, job_id: u64, amount: i128) -> Result<(), EscrowError> {
        let key = (symbol_short!("job"), job_id);
        let mut job: Job = env.storage().instance().get(&key)
            .ok_or(EscrowError::JobNotFound)?;

        // Verify caller is the client
        if invoker != job.client {
            return Err(EscrowError::Unauthorized);
        }

        if job.status != JobStatus::InProgress {
            return Err(EscrowError::InvalidJobStatus);
        }

        if amount != job.budget {
            return Err(EscrowError::InvalidAmount);
        }

        // Get USDC token address
        let usdc_token = Self::get_usdc_token(env)?;
        let token_client = TokenClient::new(env, &usdc_token);

        // Transfer tokens from client to contract
        token_client.transfer(&job.client, &env.current_contract_address(), &amount);

        job.status = JobStatus::Funded;
        env.storage().instance().set(&key, &job);
        
        emit_funds_deposited(env, job_id, amount);
        Ok(())
    }

    /// Complete a milestone
    pub fn complete_milestone(
        env: &Env,
        invoker: Address,
        job_id: u64,
        milestone_id: u64,
    ) -> Result<(), EscrowError> {
        let key = (symbol_short!("job"), job_id);
        let mut job: Job = env.storage().instance().get(&key)
            .ok_or(EscrowError::JobNotFound)?;

        // Verify caller is the freelancer
        let freelancer = job.freelancer.as_ref().ok_or(EscrowError::NoFreelancer)?;
        if &invoker != freelancer {
            return Err(EscrowError::Unauthorized);
        }

        if job.status != JobStatus::Funded {
            return Err(EscrowError::InvalidJobStatus);
        }

        let idx = (milestone_id - 1) as u32;
        let milestone = job.milestones.get(idx)
            .ok_or(EscrowError::MilestoneNotFound)?;

        if milestone.status != MilestoneStatus::Pending {
            return Err(EscrowError::InvalidMilestoneStatus);
        }

        // Update milestone status
        let mut updated = milestone.clone();
        updated.status = MilestoneStatus::Completed;
        job.milestones.set(idx, updated);

        env.storage().instance().set(&key, &job);
        Ok(())
    }

    /// Approve a milestone and release payment
    pub fn approve_milestone(
        env: &Env,
        invoker: Address,
        job_id: u64,
        milestone_id: u64,
    ) -> Result<(), EscrowError> {
        let key = (symbol_short!("job"), job_id);
        let mut job: Job = env.storage().instance().get(&key)
            .ok_or(EscrowError::JobNotFound)?;

        // Verify caller is the client
        if invoker != job.client {
            return Err(EscrowError::Unauthorized);
        }

        if job.status != JobStatus::Funded {
            return Err(EscrowError::InvalidJobStatus);
        }

        let idx = (milestone_id - 1) as u32;
        let milestone = job.milestones.get(idx)
            .ok_or(EscrowError::MilestoneNotFound)?;

        if milestone.status != MilestoneStatus::Completed {
            return Err(EscrowError::InvalidMilestoneStatus);
        }

        // Calculate payment amount
        let payment_amount = (job.budget * milestone.percentage as i128) / 100;

        // Get USDC token address
        let usdc_token = Self::get_usdc_token(env)?;
        let token_client = TokenClient::new(env, &usdc_token);

        // Transfer tokens from contract to freelancer
        let freelancer = job.freelancer.as_ref().ok_or(EscrowError::NoFreelancer)?;
        token_client.transfer(&env.current_contract_address(), freelancer, &payment_amount);

        // Update milestone status
        let mut updated = milestone.clone();
        updated.status = MilestoneStatus::Paid;
        job.milestones.set(idx, updated);

        // Check if all milestones are paid
        let all_paid = job.milestones.iter()
            .all(|m| m.status == MilestoneStatus::Paid);

        if all_paid {
            job.status = JobStatus::Completed;
        }

        env.storage().instance().set(&key, &job);
        
        emit_milestone_paid(env, job_id, milestone_id, payment_amount);
        Ok(())
    }

    /// Get job details
    pub fn get_job(env: &Env, job_id: u64) -> Result<Job, EscrowError> {
        let key = (symbol_short!("job"), job_id);
        env.storage().instance().get(&key)
            .ok_or(EscrowError::JobNotFound)
    }

    /// Initiate a dispute for a job
    pub fn initiate_dispute(
        env: &Env,
        invoker: Address,
        job_id: u64,
        reason: String,
    ) -> Result<(), EscrowError> {
        let key = (symbol_short!("job"), job_id);
        let mut job: Job = env.storage().instance().get(&key)
            .ok_or(EscrowError::JobNotFound)?;

        // Verify caller is either client or freelancer
        let freelancer = job.freelancer.as_ref().ok_or(EscrowError::NoFreelancer)?;
        if invoker != job.client && &invoker != freelancer {
            return Err(EscrowError::Unauthorized);
        }

        if job.status != JobStatus::Funded && job.status != JobStatus::InProgress {
            return Err(EscrowError::InvalidJobStatus);
        }

        job.status = JobStatus::Disputed;
        env.storage().instance().set(&key, &job);

        // Emit dispute event
        emit_dispute_initiated(env, job_id, invoker, reason);
        Ok(())
    }

    /// Cancel a job
    pub fn cancel_job(
        env: &Env,
        invoker: Address,
        job_id: u64,
    ) -> Result<(), EscrowError> {
        let key = (symbol_short!("job"), job_id);
        let mut job: Job = env.storage().instance().get(&key)
            .ok_or(EscrowError::JobNotFound)?;

        // Only client can cancel before funding, both parties can cancel after funding
        if job.status == JobStatus::Open {
            if invoker != job.client {
                return Err(EscrowError::Unauthorized);
            }
        } else if job.status == JobStatus::Funded {
            let freelancer = job.freelancer.as_ref().ok_or(EscrowError::NoFreelancer)?;
            if invoker != job.client && &invoker != freelancer {
                return Err(EscrowError::Unauthorized);
            }
        } else {
            return Err(EscrowError::InvalidJobStatus);
        }

        // If job is funded, return funds to client
        if job.status == JobStatus::Funded {
            let usdc_token = Self::get_usdc_token(env)?;
            let token_client = TokenClient::new(env, &usdc_token);
            token_client.transfer(&env.current_contract_address(), &job.client, &job.budget);
        }

        job.status = JobStatus::Cancelled;
        env.storage().instance().set(&key, &job);

        // Emit cancellation event
        emit_job_cancelled(env, job_id, invoker);
        Ok(())
    }

    /// Validate milestone due dates
    fn validate_milestone_dates(env: &Env, milestones: &Vec<Milestone>) -> Result<(), EscrowError> {
        let current_time = env.ledger().timestamp();
        for milestone in milestones.iter() {
            if milestone.due_date <= current_time {
                return Err(EscrowError::InvalidMilestoneDates);
            }
        }
        Ok(())
    }
} 