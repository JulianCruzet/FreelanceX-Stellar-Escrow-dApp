#![no_std]

use soroban_sdk::{contract, contractimpl, symbol_short, vec, Address, Env, Symbol, Vec};

#[contract]
pub struct EscrowContract;

#[contractimpl]
impl EscrowContract {
    pub fn initialize(
        env: &Env,
        client: Address,
        freelancer: Address,
        amount: i128,
        milestones: Vec<Symbol>,
    ) {
        // Store the job details in the contract
        env.storage().instance().set(&symbol_short!("client"), &client);
        env.storage().instance().set(&symbol_short!("freelancer"), &freelancer);
        env.storage().instance().set(&symbol_short!("amount"), &amount);
        env.storage().instance().set(&symbol_short!("milestones"), &milestones);
    }

    pub fn approve_milestone(env: &Env, milestone_index: u32) {
        // Only client can approve milestones
        let client: Address = env.storage().instance().get(&symbol_short!("client")).unwrap();
        client.require_auth();

        // Get milestone details and release payment
        let freelancer: Address = env.storage().instance().get(&symbol_short!("freelancer")).unwrap();
        let amount: i128 = env.storage().instance().get(&symbol_short!("amount")).unwrap();
        
        // In a real implementation, you would:
        // 1. Verify the milestone exists
        // 2. Calculate the payment amount based on milestone percentage
        // 3. Transfer the funds to the freelancer
        // 4. Update the contract state
    }

    pub fn get_job_details(env: &Env) -> (Address, Address, i128, Vec<Symbol>) {
        let client: Address = env.storage().instance().get(&symbol_short!("client")).unwrap();
        let freelancer: Address = env.storage().instance().get(&symbol_short!("freelancer")).unwrap();
        let amount: i128 = env.storage().instance().get(&symbol_short!("amount")).unwrap();
        let milestones: Vec<Symbol> = env.storage().instance().get(&symbol_short!("milestones")).unwrap();
        
        (client, freelancer, amount, milestones)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::Address as _;

    #[test]
    fn test_initialize() {
        let env = Env::default();
        let contract_id = env.register_contract(None, EscrowContract);
        let client = Address::generate(&env);
        let freelancer = Address::generate(&env);
        let amount = 1000;
        let milestones = vec![&env, symbol_short!("milestone1"), symbol_short!("milestone2")];

        contract_id.initialize(&client, &freelancer, &amount, &milestones);
        
        let (stored_client, stored_freelancer, stored_amount, stored_milestones) = 
            contract_id.get_job_details();
        
        assert_eq!(stored_client, client);
        assert_eq!(stored_freelancer, freelancer);
        assert_eq!(stored_amount, amount);
        assert_eq!(stored_milestones, milestones);
    }
} 