/*
module suiref_contract::suiref_contract {
    use sui::package;
    use sui::display;

    public struct SUIREF_CONTRACT has drop {}

    fun init(otw: SUIREF_CONTRACT, ctx: &mut TxContext) {
        let publisher = package::claim(otw, ctx);

        let mut d = display::new<UserProfile>(&publisher, ctx);

        // Use common keys widely supported by wallets/explorers.
        display::add(&mut d, b"profiler".to_string(), b"@{username}".to_string());
        display::add(
            &mut d,
            b"like what you see?".to_string(),
            b"Invites: {invites} • Referrals: {referral_counts}".to_string()
        );
        display::add(
            &mut d,
            b"link".to_string(),
            b"https://app.suiref.xyz/u/{id}".to_string()
        );
        display::add(
            &mut d,
            b"thumbnail_url".to_string(),
            b"https://api.suiref.xyz/avatar/{username}?s=64".to_string()
        );
        display::add(
            &mut d,
            b"creator".to_string(),
            b"Suiref".to_string()
        );


        // Important: call on templates change  (not when profile data changes) .
        display::update_version(&mut d);

        transfer::public_transfer(publisher, ctx.sender());
        transfer::public_transfer(d, ctx.sender())
    }
}