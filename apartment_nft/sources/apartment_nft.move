module apartment_nft::sui_eth_enugu;

public struct ApartmenNft has key, store {
    id: UID,
    name: std::string::String,
    description: std::string::String,
    url: sui::url::Url,
    location: std::string::String,
    house_owner: address
}

entry fun mint(ctx: &mut TxContext)
{
    let new_apartment_nft = ApartmenNft {
        id: object::new(ctx),
        name: b"cafe one".to_string(),
        description: b"Coffee shop".to_string(),
        url: sui::url::new_unsafe(std::ascii::string(b"https://walrus.tusky.io/O5MuRiAiIiwEvp9S0MvvFIeLGb0vSa1qyZGuxiIj6h8")),
        location: b"cafe one, opara avenue".to_string(),
        house_owner: ctx.sender()
    };

    transfer::public_transfer(new_apartment_nft, ctx.sender())
}

entry fun send_nft(recipient: address, nft: ApartmenNft ){
    transfer::public_transfer(nft, recipient)
}

entry fun burn_nft(nft:ApartmenNft )
{
    let ApartmenNft {id: id, name: _, description: _, url: _, location: _, house_owner: _} = nft;
    object::delete(id)
}