#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Symbol, Vec};

#[contract]
pub struct BountyContract;

#[contracttype]
enum DataKey {
    Creator,
    Description,
    Token,
    Amount,
    IsClaimed,
}

#[contractimpl]
impl BountyContract {
    pub fn post_bounty(
        env: Env,
        creator: Address,
        description: String,
        token: Address,
        amount: i128,
    ) {
        creator.require_auth();

        env.storage().persistent().set(&DataKey::Creator, &creator);
        env.storage()
            .persistent()
            .set(&DataKey::Description, &description);
        env.storage().persistent().set(&DataKey::Token, &token);
        env.storage().persistent().set(&DataKey::Amount, &amount);
        env.storage().persistent().set(&DataKey::IsClaimed, &false);
    }

    pub fn get_bounty(env: Env) -> Vec<String> {
        let desc: String = env
            .storage()
            .persistent()
            .get(&DataKey::Description)
            .unwrap_or(String::from_str(&env, "No bounty posted"));

        let amount: i128 = env
            .storage()
            .persistent()
            .get(&DataKey::Amount)
            .unwrap_or(0);

        let claimed: bool = env
            .storage()
            .persistent()
            .get(&DataKey::IsClaimed)
            .unwrap_or(false);

        let mut result = Vec::<String>::new(&env);
        result.push_back(String::from_str(&env, "Description:"));
        result.push_back(desc);

        result.push_back(String::from_str(&env, "Reward Amount:"));
        //let amount_str: String = format!(&env, "{}", amount);

        result.push_back(String::from_str(&env, "Status:"));
        result.push_back(String::from_str(
            &env,
            if claimed { "Claimed" } else { "Open" },
        ));

        result
    }
    pub fn claim_bounty(env: Env, claimer: Address) {
        claimer.require_auth();

        let claimed: bool = env
            .storage()
            .persistent()
            .get(&DataKey::IsClaimed)
            .unwrap_or(false);
        if claimed {
            panic!("Bounty already claimed");
        }

        let token: Address = env
            .storage()
            .persistent()
            .get(&DataKey::Token)
            .expect("No token");
        let creator: Address = env
            .storage()
            .persistent()
            .get(&DataKey::Creator)
            .expect("No creator");
        let amount: i128 = env
            .storage()
            .persistent()
            .get(&DataKey::Amount)
            .expect("No amount");

        let client = soroban_sdk::token::Client::new(&env, &token);
        client.transfer(&creator, &claimer, &amount);

        env.storage().persistent().set(&DataKey::IsClaimed, &true);
    }
}

mod test;
