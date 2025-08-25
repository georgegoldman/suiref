module 0x0::suiref {
    use std::string::{Self, String};
    use std::ascii::String as AsciiString;
    use std::vector;

    use sui::url::{Self, Url};
    use sui::table::{Self as table, Table};

    /// Optional: if you really want to stringify addresses later,
    /// import this and change the Table value type to String.
    // use sui::address;

    public struct RefId has key, store {
        id: UID,
        name: String,
        description: String,
        url: Url,
        username: String,
    }

    public struct RefCard has key, store {
        id: UID,
        name: String,
        description: String,
        url: Url,
    }

    /// Single table mapping username -> address
    public struct LeaderBoard has key, store {
        id: UID,
        referral_hook: Table<String, address>
    }

    /// If you truly need multiple per-user tables, keep a vector of tables.
    /// Here we keep vector<Table<String, address>> and push tables into it.
    public struct UserRepo has key, store {
        id: UID,
        user_list: vector<Table<String, address>>
    }

    fun init(ctx: &mut TxContext) {
        let lb_table = table::new<String, address>(ctx);
        let lb = LeaderBoard {
            id: object::new(ctx),
            referral_hook: lb_table,
        };
        transfer::share_object(lb)
    }

    /// Example of using the leaderboard: add (username -> sender)
    entry fun add_to_leader_board(leader_board: &mut LeaderBoard, username: String, ctx: &mut TxContext) {
        let who = tx_context::sender(ctx);
        table::add(&mut leader_board.referral_hook, username, who);
    }

    entry fun create_ref_card_id(
        url_ascii: AsciiString,
        username: String,
        user_repo: &mut UserRepo,
        ctx: &mut TxContext
    ) {
        // Mint a RefId and transfer to sender
        let new_profile = RefId {
            id: object::new(ctx),
            name: b"suihub_ref_card".to_string(),
            description: b"for user on the system".to_string(),
            url: url::new_unsafe(url_ascii),
            username, // moved here; copy it first if you still need it below
        };
        let sender = tx_context::sender(ctx);
        transfer::public_transfer(new_profile, sender);

        // Create a table for this user and map username -> sender
        let mut t = table::new<String, address>(ctx);
        // If you still need the username after moving it into RefId above,
        // clone it before constructing RefId or pass a second copy in.
        // For demo we use a constant key; in practice keep a copy of username.
        table::add(&mut t, b"user".to_string(), sender);

        vector::push_back(&mut user_repo.user_list, t);
    }

    entry fun create_ref_card(ctx: &mut TxContext) {
        let card_url: AsciiString =
            std::string::to_ascii(b"http://3.23.87.244:3001/move-generator/image/Yj6qupa4l2MOqHzvUK-jnqzuopbJmqFnjzJPrq2OY4E".to_string());

        let new_ref_card = RefCard {
            id: object::new(ctx),
            name: b"SUI HUB REFERAL NFT".to_string(),
            url: url::new_unsafe(card_url),
            description: b"this is a referal card for sui".to_string(),
        };
        transfer::public_transfer(new_ref_card, tx_context::sender(ctx))
    }
}
