import { useCurrentAccount } from "@mysten/dapp-kit";
import CopyIcon from "../assets/copy-icon";

const Wallets = () => {
  const currentAccount = useCurrentAccount();

  // Helper function to shorten wallet address
  const shortenAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  return (
    <div className="flex-1 flex flex-col gap-[1.875rem] p-4 sm:p-6">
      <div className="flex flex-col gap-[0.625rem]">
        <h2 className="text-2xl font-bold">Wallet</h2>
        <p className="text-white/60 text-xs font-medium">
          Connect your sui compactible wallet to receive rewards and NFTs
        </p>
      </div>

      {currentAccount ? (
        <div className="border border-[#4DA2FD] flex flex-col justify-between rounded-[1.25rem] w-full max-w-[clamp(16rem,70vw,20.9375rem)]">
          <div className="flex flex-col gap-[0.5rem] p-[1.25rem]">
            <p className="text-white/60 text-xs font-normal">
              Wallet connected
            </p>
            <div className="flex items-center gap-[0.625rem]">
              <p className="text-white/80 text-sm font-normal">
                {shortenAddress(currentAccount.address)}
              </p>
              <div
                className="cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(currentAccount.address);
                }}
              >
                <CopyIcon />
              </div>
            </div>
          </div>

          <button className="bg-[#4DA2FD] rounded-[0.9375rem] w-full h-[clamp(2.25rem,6vh,2.625rem)] text-white text-xs font-normal">
            Add Wallet
          </button>
        </div>
      ) : (
        <div className="bg-white p-[1.25rem] rounded-[1.25rem] flex flex-col gap-[1.25rem] w-full max-w-[clamp(18rem,85vw,29.5rem)] min-h-[clamp(8rem,30vh,10.125rem)]">
          <div className="flex flex-col gap-[0.5rem]">
            <h4 className="text-[1.25rem] font-bold text-[#040C33]">
              No Connected Wallet
            </h4>
            <p className="text-black/50 text-sm font-medium">
              Connect wallet to start earning rewards
            </p>
          </div>
          <button className="bg-[#040C33] rounded-[0.9375rem] w-[clamp(9rem,40vw,10.625rem)] h-[clamp(2.5rem,7vh,3.125rem)] text-white text-sm font-medium">
            Connect Wallet
          </button>
        </div>
      )}
    </div>
  );
};

export default Wallets;
