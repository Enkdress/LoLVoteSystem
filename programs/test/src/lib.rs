use anchor_lang::prelude::*;

declare_id!("5G7W9cnCVxyEvdVGjryXoqngUb8BcoZmwUp8QBsSB9iM");

#[program]
pub mod pokemon {
    use super::*;
    pub fn initialize(ctx: Context<Init>) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        base_account.total_votes = 0;
        Ok(())
    }
    pub fn vote(
        ctx: Context<Vote>,
        pkm_one: String,
        pkm_two: String,
        pkm_voted: String,
    ) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        let mut has_pair: bool = false;

        // search in the pokemon pair list if
        // pkm_one and pkm_two pair exists
        //
        // if exists +1 to the pkm voted
        for pair in base_account.pokemon_pairs.iter_mut() {
            if pair.pokemon_one == pkm_one && pair.pokemon_two == pkm_two {
                has_pair = true;
                if pkm_voted == pair.pokemon_one {
                    pair.pokemon_one_votes += 1;
                } else {
                    pair.pokemon_two_votes += 1;
                }
                break;
            }
        }

        // if not exist push it with the voted
        // pokemon
        if !has_pair {
            if pkm_voted == pkm_one {
                let item = ItemStruct {
                    pokemon_one: pkm_one,
                    pokemon_two: pkm_two,
                    pokemon_one_votes: 1,
                    pokemon_two_votes: 0,
                };
                base_account.pokemon_pairs.push(item);
            } else {
                let item = ItemStruct {
                    pokemon_one: pkm_one,
                    pokemon_two: pkm_two,
                    pokemon_one_votes: 0,
                    pokemon_two_votes: 1,
                };
                base_account.pokemon_pairs.push(item);
            }
        }

        base_account.total_votes += 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Init<'info> {
    #[account(init, payer = user, space = 9000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Vote<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
}

// Create a custom struct for us to work with.
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub pokemon_one: String,
    pub pokemon_one_votes: i64,
    pub pokemon_two: String,
    pub pokemon_two_votes: i64,
}

#[account]
pub struct BaseAccount {
    pub total_votes: i64,
    pub pokemon_pairs: Vec<ItemStruct>,
}
