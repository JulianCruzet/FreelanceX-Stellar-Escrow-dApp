# FreelanceX Escrow Smart Contract

This is the core smart contract for the FreelanceX platform, built on Stellar Soroban. It handles the escrow functionality for freelance jobs and milestone-based payments.

## Features

- Job creation with milestone-based structure
- Secure escrow for funds
- Milestone completion and approval workflow
- Automatic payment release upon milestone approval
- Event emission for frontend tracking
- Error handling for various scenarios

## Contract Functions

### Job Management
- `create_job`: Create a new job with milestones
- `accept_job`: Accept a job as a freelancer
- `get_job`: Get job details

### Payment Management
- `deposit_funds`: Deposit funds into escrow
- `complete_milestone`: Mark a milestone as completed
- `approve_milestone`: Approve a milestone and release payment

## Data Structures

### Job
```rust
pub struct Job {
    pub id: u64,
    pub client: Address,
    pub freelancer: Option<Address>,
    pub budget: i128,
    pub status: JobStatus,
    pub milestones: Vec<Milestone>,
}
```

### Milestone
```rust
pub struct Milestone {
    pub id: u64,
    pub title: String,
    pub description: String,
    pub percentage: u32,
    pub due_date: u64,
    pub status: MilestoneStatus,
}
```

## Status Enums

### JobStatus
- Open
- InProgress
- Funded
- Completed
- Disputed
- Cancelled

### MilestoneStatus
- Pending
- InProgress
- Completed
- Paid
- Disputed

## Events

The contract emits events for important state changes:
- Job creation
- Job acceptance
- Fund deposits
- Milestone completion
- Milestone payment
- Dispute initiation

## Error Handling

The contract includes comprehensive error handling for various scenarios:
- Job not found
- Milestone not found
- Invalid job/milestone status
- Invalid amounts
- Unauthorized actions
- Token transfer failures

## Development

### Prerequisites
- Rust 1.70 or later
- Soroban CLI
- Stellar development environment

### Building
```bash
cargo build --target wasm32-unknown-unknown --release
```

### Testing
```bash
cargo test
```

## Security Considerations

- All state changes are validated
- Funds are held in escrow until milestone approval
- Milestone percentages must sum to 100%
- Only authorized parties can perform actions
- Events are emitted for all important state changes

## Future Improvements

- Dispute resolution mechanism
- Multi-token support
- Time-locked refunds
- Reputation system integration
- Automated milestone verification 