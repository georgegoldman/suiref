module suiref_contract::activity {


    public struct ReferralRecord has store {
        referral: address,
        referree: address
    }

    public struct ReferralPool has key, store {
        id: UID,
        referal_list: vector<ReferralRecord>
    }
}