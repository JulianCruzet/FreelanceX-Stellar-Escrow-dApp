use soroban_sdk::{Address, Env, Symbol, String, symbol_short};

pub(crate) const JOB_CREATED: Symbol = symbol_short!("job_cre");
pub(crate) const FUNDS_DEPOSITED: Symbol = symbol_short!("fund_dep");
pub(crate) const MILESTONE_PAID: Symbol = symbol_short!("mile_pay");
pub(crate) const DISPUTE_INITIATED: Symbol = symbol_short!("disp_init");
pub(crate) const JOB_CANCELLED: Symbol = symbol_short!("job_can");

pub fn emit_job_created(env: &Env, job_id: u64, client: Address) {
    env.events().publish(
        (JOB_CREATED,),
        (job_id, client),
    );
}

pub fn emit_job_accepted(env: &Env, job_id: u64, freelancer: Address) {
    let topics = (Symbol::new(env, "job_accepted"), job_id);
    env.events().publish(topics, freelancer);
}

pub fn emit_funds_deposited(env: &Env, job_id: u64, amount: i128) {
    env.events().publish(
        (FUNDS_DEPOSITED,),
        (job_id, amount),
    );
}

pub fn emit_milestone_completed(env: &Env, job_id: u64, milestone_id: u64) {
    let topics = (Symbol::new(env, "milestone_completed"), job_id);
    env.events().publish(topics, milestone_id);
}

pub fn emit_milestone_paid(env: &Env, job_id: u64, milestone_id: u64, amount: i128) {
    env.events().publish(
        (MILESTONE_PAID,),
        (job_id, milestone_id, amount),
    );
}

pub fn emit_dispute_initiated(env: &Env, job_id: u64, initiator: Address, reason: String) {
    env.events().publish(
        (DISPUTE_INITIATED,),
        (job_id, initiator, reason),
    );
}

pub fn emit_job_cancelled(env: &Env, job_id: u64, cancelled_by: Address) {
    env.events().publish(
        (JOB_CANCELLED,),
        (job_id, cancelled_by),
    );
} 