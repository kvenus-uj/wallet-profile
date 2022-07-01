use anchor_lang::prelude::*;

declare_id!("Cg9B3hHWRqMUMbW6dw2v3gzL2gKSgJVcsV6GA64xnEdK");
pub mod constants {
    pub const PROFILE_PDA_SEED: &[u8] = b"wallet_profile";
}
#[program]
pub mod anchor_profile {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>, _profile_account_bump: u8) -> ProgramResult {
        ctx.accounts.profile_account.authority = *ctx.accounts.user.key;
        Ok(())
    }

    pub fn create_profile(ctx: Context<CreateProfile>, _user_account_bump: u8, name: String, location: String) -> ProgramResult {
        ctx.accounts.user_account.authority = *ctx.accounts.authority.key;
        ctx.accounts.user_account.name = name;
        ctx.accounts.user_account.location = location;
        ctx.accounts.user_account.likes = 0;
        Ok(())
    }

    pub fn update_profile(ctx: Context<UpdateProfile>, name: String, location: String) -> ProgramResult {
        ctx.accounts.user_account.name = name;
        ctx.accounts.user_account.location = location;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(_profile_account_bump: u8)]
pub struct Initialize<'info> {
    #[account(
        init,
        seeds = [ constants::PROFILE_PDA_SEED.as_ref() ],
        bump = _profile_account_bump,
        payer = user
    )]
    profile_account: Account<'info, Profile>,
    #[account(mut)]
    user: Signer<'info>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(_user_account_bump: u8)]
pub struct CreateProfile<'info> {
    #[account(mut)]
    pub profile_account: Account<'info, Profile>,
    #[account(
        init,
        seeds = [ authority.key().as_ref() ],
        bump = _user_account_bump,
        payer = authority,
        space = 10000
    )]
    pub user_account: Account<'info, UserProfile>,
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct UpdateProfile<'info> {
    #[account(mut)]
    pub profile_account: Account<'info, Profile>,
    #[account(mut, has_one = authority)]
    pub user_account: Account<'info, UserProfile>,
    pub authority: Signer<'info>,
}

#[account]
#[derive(Default)]
pub struct Profile {
    pub authority: Pubkey,
}

#[account]
#[derive(Default)]
pub struct UserProfile {
    pub authority: Pubkey,
    pub likes: u8,
    pub name: String,
    pub location: String,
}
