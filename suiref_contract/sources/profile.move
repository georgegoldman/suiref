module suiref_contract::profile {
    
    public struct UserProfile has key, store {
        id: UID,
        name: std::string::String,
        thumbnail_url: sui::url::Url,
        description: std::string::String,
        url: sui::url::Url,
        username: std::string::String,
        owner: address,
        invites: u32,
        referral_counts: u32,
    }

    entry fun create_profile(url: std::ascii::String, username: std::string::String, ctx: &mut TxContext) {
        let new_user = UserProfile {
            id: object::new(ctx),
            name: b"suiref_profile".to_string(),
            thumbnail_url: sui::url::new_unsafe(url),
            description: b"this is an onchain badge for reffereal".to_string(),
            url: sui::url::new_unsafe(url),
            username,
            owner: ctx.sender(),
            invites: 0,
            referral_counts: 0
        };
        transfer::public_transfer(new_user, ctx.sender())
    }

    entry fun destroy_profile(profile: UserProfile){
        let UserProfile { id: id, name: _, thumbnail_url: _, description: _, url: _, username: _, owner: _, invites: _, referral_counts: _ } = profile;
        object::delete(id);
    }

}