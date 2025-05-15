use soroban_sdk::{
    contracttype, Address, Vec, String,
};

#[derive(Clone, Debug, Eq, PartialEq)]
#[contracttype]
pub enum JobStatus {
    Open,
    InProgress,
    Funded,
    Completed,
    Disputed,
    Cancelled,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MilestoneStatus {
    Pending,
    Completed,
    Paid,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Milestone {
    pub id: u64,
    pub title: String,
    pub description: String,
    pub percentage: u32,
    pub due_date: u64,
    pub status: MilestoneStatus,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Job {
    pub id: u64,
    pub client: Address,
    pub freelancer: Option<Address>,
    pub budget: i128,
    pub status: JobStatus,
    pub milestones: Vec<Milestone>,
} 