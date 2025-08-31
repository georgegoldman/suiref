module suiref_contract::profile {


    public struct ReferralRecord has store, copy, drop {
        referral: address,
        referree: address
    }

    public struct ReferralPool has key, store {
        id: UID,
        referal_list: vector<ReferralRecord>
    }

    fun init(ctx: &mut TxContext){
        // create referral pool
        let ref_pool = ReferralPool { id: object::new(ctx), referal_list: vector::empty<ReferralRecord>() };
        transfer::public_share_object(ref_pool);
    }

    
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

    entry fun add_referral_to_record(referrer: &UserProfile, referree: &UserProfile, ref_pool: &mut ReferralPool){
        let newReferralRecord = ReferralRecord { referral: referrer.owner, referree: referree.owner };
        assert!(!ref_pool.referal_list.contains(&newReferralRecord), 0);
        ref_pool.referal_list.push_back(newReferralRecord)
    }

}