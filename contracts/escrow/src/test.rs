use soroban_sdk::{
    testutils::Address as _,
    Address, Env, String, Vec,
    token::TokenClient,
};

use crate::{
    FreelanceXEscrow, FreelanceXEscrowClient,
    types::{Milestone, JobStatus, MilestoneStatus},
    errors::EscrowError,
};

// Mock token contract for testing with correct ABI
use soroban_sdk::{contract, contractimpl, symbol_short, Val};

#[contract]
pub struct MockTokenContract;

#[contractimpl]
impl MockTokenContract {
    pub fn approve(
        _env: &Env,
        from: Address,
        spender: Address,
        amount: i128,
        expiration: i128,
    ) -> i128 {
        let _ = (from, spender, amount, expiration);
        0
    }
    pub fn transfer(
        _env: &Env,
        from: Address,
        to: Address,
        amount: i128,
    ) -> i128 {
        let _ = (from, to, amount);
        0
    }
}

fn create_mock_token_contract(e: &Env) -> Address {
    e.register_contract(None, MockTokenContract)
}

fn create_token_contract<'a>(e: &'a Env, _admin: &Address) -> TokenClient<'a> {
    // Use a dummy contract address for testing
    let dummy_contract_id = Address::generate(e);
    TokenClient::new(e, &dummy_contract_id)
}

fn create_contract(e: &Env) -> FreelanceXEscrowClient {
    let contract_id = e.register_contract(None, FreelanceXEscrow);
    FreelanceXEscrowClient::new(e, &contract_id)
}

fn create_milestones(e: &Env) -> Vec<Milestone> {
    Vec::from_array(e, [
        Milestone {
            title: String::from_str(e, "Design"),
            description: String::from_str(e, "Create UI/UX design"),
            percentage: 30,
            due_date: 1000,
            status: MilestoneStatus::Pending,
        },
        Milestone {
            title: String::from_str(e, "Development"),
            description: String::from_str(e, "Implement features"),
            percentage: 70,
            due_date: 2000,
            status: MilestoneStatus::Pending,
        },
    ])
}

#[test]
fn test_create_job() {
    let env = Env::default();
    let client = Address::generate(&env);
    let usdc_token = create_token_contract(&env, &client);

    let contract_id = env.register_contract(None, FreelanceXEscrow);
    let escrow = FreelanceXEscrowClient::new(&env, &contract_id);

    let milestones = Vec::from_array(&env, [
        Milestone {
            title: String::from_str(&env, "Design"),
            description: String::from_str(&env, "Create initial design"),
            percentage: 30,
            due_date: 1234567890,
            status: MilestoneStatus::Pending,
        },
        Milestone {
            title: String::from_str(&env, "Development"),
            description: String::from_str(&env, "Implement features"),
            percentage: 70,
            due_date: 1234567890,
            status: MilestoneStatus::Pending,
        },
    ]);

    let job_id = escrow.create_job(&client, &1000, &milestones);
    assert_eq!(job_id, 1);

    let job = escrow.get_job(&job_id);
    assert_eq!(job.client, client);
    assert_eq!(job.freelancer, None);
    assert_eq!(job.budget, 1000);
    assert_eq!(job.status, JobStatus::Open);
    assert_eq!(job.milestones.len(), 2);
}

#[test]
fn test_accept_job() {
    let env = Env::default();
    let client = Address::generate(&env);
    let freelancer = Address::generate(&env);
    let usdc_token = create_token_contract(&env, &client);

    let contract_id = env.register_contract(None, FreelanceXEscrow);
    let escrow = FreelanceXEscrowClient::new(&env, &contract_id);
    
    // Initialize the contract with the USDC token address
    escrow.initialize(&usdc_token.address);

    let milestones = Vec::from_array(&env, [
        Milestone {
            title: String::from_str(&env, "Design"),
            description: String::from_str(&env, "Create initial design"),
            percentage: 30,
            due_date: 1234567890,
            status: MilestoneStatus::Pending,
        },
        Milestone {
            title: String::from_str(&env, "Development"),
            description: String::from_str(&env, "Implement features"),
            percentage: 70,
            due_date: 1234567890,
            status: MilestoneStatus::Pending,
        },
    ]);

    let job_id = escrow.create_job(&client, &1000, &milestones);
    escrow.accept_job(&freelancer, &job_id, &freelancer);

    let job = escrow.get_job(&job_id);
    assert_eq!(job.status, JobStatus::InProgress);
    assert_eq!(job.freelancer, Some(freelancer));
}

#[test]
fn test_deposit_funds() {
    let env = Env::default();
    let client = Address::generate(&env);
    let freelancer = Address::generate(&env);
    let token_address = create_mock_token_contract(&env);
    let usdc_token = TokenClient::new(&env, &token_address);

    let contract_id = env.register_contract(None, FreelanceXEscrow);
    let escrow = FreelanceXEscrowClient::new(&env, &contract_id);
    // Initialize the contract with the mock token address
    escrow.initialize(&usdc_token.address);

    let milestones = Vec::from_array(&env, [
        Milestone {
            title: String::from_str(&env, "Design"),
            description: String::from_str(&env, "Create initial design"),
            percentage: 30,
            due_date: 1234567890,
            status: MilestoneStatus::Pending,
        },
        Milestone {
            title: String::from_str(&env, "Development"),
            description: String::from_str(&env, "Implement features"),
            percentage: 70,
            due_date: 1234567890,
            status: MilestoneStatus::Pending,
        },
    ]);

    let job_id = escrow.create_job(&client, &1000, &milestones);
    escrow.accept_job(&freelancer, &job_id, &freelancer);

    // Approve the contract to spend tokens (mock, no real effect)
    usdc_token.approve(&client, &contract_id, &1000, &1000);
    // Deposit funds
    escrow.deposit_funds(&client, &job_id, &1000);

    let job = escrow.get_job(&job_id);
    assert_eq!(job.status, JobStatus::Funded);
}

#[test]
fn test_complete_and_approve_milestone() {
    let env = Env::default();
    let client = Address::generate(&env);
    let freelancer = Address::generate(&env);
    let token_address = create_mock_token_contract(&env);
    let usdc_token = TokenClient::new(&env, &token_address);

    let contract_id = env.register_contract(None, FreelanceXEscrow);
    let escrow = FreelanceXEscrowClient::new(&env, &contract_id);
    // Initialize the contract with the mock token address
    escrow.initialize(&usdc_token.address);

    let milestones = Vec::from_array(&env, [
        Milestone {
            title: String::from_str(&env, "Design"),
            description: String::from_str(&env, "Create initial design"),
            percentage: 30,
            due_date: 1234567890,
            status: MilestoneStatus::Pending,
        },
        Milestone {
            title: String::from_str(&env, "Development"),
            description: String::from_str(&env, "Implement features"),
            percentage: 70,
            due_date: 1234567890,
            status: MilestoneStatus::Pending,
        },
    ]);

    let job_id = escrow.create_job(&client, &1000, &milestones);
    escrow.accept_job(&freelancer, &job_id, &freelancer);

    // Approve the contract to spend tokens (mock, no real effect)
    usdc_token.approve(&client, &contract_id, &1000, &1000);
    // Deposit funds
    escrow.deposit_funds(&client, &job_id, &1000);

    // Complete and approve milestone
    escrow.complete_milestone(&freelancer, &0, &job_id);
    escrow.approve_milestone(&client, &0, &job_id);

    let job = escrow.get_job(&job_id);
    assert_eq!(job.milestones.get_unchecked(0).status, MilestoneStatus::Paid);
}

#[test]
fn test_unauthorized_operations() {
    let env = Env::default();
    let client = Address::generate(&env);
    let freelancer = Address::generate(&env);
    let unauthorized = Address::generate(&env);
    let token_address = create_mock_token_contract(&env);
    let usdc_token = TokenClient::new(&env, &token_address);

    let contract_id = env.register_contract(None, FreelanceXEscrow);
    let escrow = FreelanceXEscrowClient::new(&env, &contract_id);
    // Initialize the contract with the mock token address
    escrow.initialize(&usdc_token.address);

    let milestones = Vec::from_array(&env, [
        Milestone {
            title: String::from_str(&env, "Design"),
            description: String::from_str(&env, "Create initial design"),
            percentage: 30,
            due_date: 1234567890,
            status: MilestoneStatus::Pending,
        },
        Milestone {
            title: String::from_str(&env, "Development"),
            description: String::from_str(&env, "Implement features"),
            percentage: 70,
            due_date: 1234567890,
            status: MilestoneStatus::Pending,
        },
    ]);

    let job_id = escrow.create_job(&client, &1000, &milestones);
    escrow.accept_job(&freelancer, &job_id, &freelancer);
    // Approve the contract to spend tokens (mock, no real effect)
    usdc_token.approve(&client, &contract_id, &1000, &1000);
    // Deposit funds
    escrow.deposit_funds(&client, &job_id, &1000);

    // Test unauthorized job acceptance
    let result = escrow.try_accept_job(&unauthorized, &job_id, &freelancer);
    assert_eq!(result, Err(Ok(EscrowError::Unauthorized)));

    // Test unauthorized milestone completion
    let result = escrow.try_complete_milestone(&unauthorized, &0, &job_id);
    assert_eq!(result, Err(Ok(EscrowError::Unauthorized)));

    // Test unauthorized milestone approval
    let result = escrow.try_approve_milestone(&unauthorized, &0, &job_id);
    assert_eq!(result, Err(Ok(EscrowError::Unauthorized)));
}

#[test]
fn test_multiple_jobs() {
    let e = Env::default();
    let admin = Address::generate(&e);
    let client1 = Address::generate(&e);
    let client2 = Address::generate(&e);
    let freelancer1 = Address::generate(&e);
    let freelancer2 = Address::generate(&e);
    
    // Create USDC token contract
    let usdc_token = create_token_contract(&e, &admin);
    
    // Create and initialize escrow contract
    let contract = create_contract(&e);
    contract.initialize(&usdc_token.address);
    
    // Mint USDC tokens to clients
    usdc_token.approve(&client1, &contract.address, &5000, &5000);
    usdc_token.approve(&client2, &contract.address, &8000, &8000);
    
    // Create first job
    let milestones1 = create_milestones(&e);
    let job_id1 = contract.create_job(&client1, &5000, &milestones1);
    
    // Create second job
    let milestones2 = create_milestones(&e);
    let job_id2 = contract.create_job(&client2, &8000, &milestones2);
    
    // Verify jobs are different
    let job1 = contract.get_job(&job_id1);
    let job2 = contract.get_job(&job_id2);
    assert_ne!(job1.id, job2.id);
    assert_eq!(job1.budget, 5000);
    assert_eq!(job2.budget, 8000);
}

#[test]
fn test_authorization_checks() {
    let env = Env::default();
    let client = Address::generate(&env);
    let freelancer = Address::generate(&env);
    let unauthorized = Address::generate(&env);
    let usdc_token = create_token_contract(&env, &client);

    let contract_id = env.register_contract(None, FreelanceXEscrow);
    let contract = FreelanceXEscrowClient::new(&env, &contract_id);
    contract.initialize(&usdc_token.address);

    let milestones = create_milestones(&env);
    let job_id = contract.create_job(&client, &10000, &milestones);
    contract.accept_job(&env.current_contract_address(), &job_id, &freelancer);

    // Test unauthorized deposit
    let result = contract.try_deposit_funds(&unauthorized, &job_id, &10000);
    assert_eq!(result, Err(Ok(EscrowError::Unauthorized)));

    // Test authorized deposit
    usdc_token.approve(&client, &contract_id, &10000, &10000);
    contract.deposit_funds(&client, &job_id, &10000);

    // Test unauthorized milestone completion
    let result = contract.try_complete_milestone(&unauthorized, &0, &job_id);
    assert_eq!(result, Err(Ok(EscrowError::Unauthorized)));

    // Test authorized milestone completion
    contract.complete_milestone(&freelancer, &0, &job_id);

    // Test unauthorized milestone approval
    let result = contract.try_approve_milestone(&unauthorized, &0, &job_id);
    assert_eq!(result, Err(Ok(EscrowError::Unauthorized)));

    // Test authorized milestone approval
    contract.approve_milestone(&client, &0, &job_id);
} 