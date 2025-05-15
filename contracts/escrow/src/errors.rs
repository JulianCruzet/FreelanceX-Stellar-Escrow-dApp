use soroban_sdk::contracterror;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum EscrowError {
    NotInitialized = 1,
    AlreadyInitialized = 2,
    JobNotFound = 3,
    JobNotOpen = 4,
    NoFreelancer = 5,
    NoMilestones = 6,
    InvalidMilestonePercentages = 7,
    InvalidJobStatus = 8,
    InvalidMilestoneStatus = 9,
    MilestoneNotFound = 10,
    Unauthorized = 11,
    InvalidAmount = 12,
    InvalidMilestoneDates = 13,
} 