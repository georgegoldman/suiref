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
    <div className="flex-1 flex flex-col gap-[30px] p-4 sm:p-6">
      <div className="flex flex-col gap-[10px]">
        <h2 className="text-2xl font-bold">Wallet</h2>
        <p className="text-white/60 text-xs font-medium">
          Connect your sui compactible wallet to receive rewards and NFTs
        </p>
      </div>

      {currentAccount ? (
        <div className="border border-[#4DA2FD] flex flex-col justify-between rounded-[20px] w-[335px]">
          <div className="flex flex-col gap-[8px] p-[20px]">
            <p className="text-white/60 text-xs font-normal">
              Wallet connected
            </p>
            <div className="flex items-center gap-[10px]">
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

          <button className="bg-[#4DA2FD] rounded-[15px] w-full h-[42px] text-white text-xs font-normal">
            Add Wallet
          </button>
        </div>
      ) : (
        <div className="bg-white p-[20px] rounded-[20px] flex flex-col gap-[20px] w-[472px] h-[162px]">
          <div className="flex flex-col gap-[8px]">
            <h4 className="text-[20px] font-bold text-[#040C33]">
              No Connected Wallet
            </h4>
            <p className="text-black/50 text-sm font-medium">
              Connect wallet to start earning rewards
            </p>
          </div>
          <button className="bg-[#040C33] rounded-[15px] w-[170px] h-[50px] text-white text-sm font-medium">
            Connect Wallet
          </button>
        </div>
      )}
    </div>
  );
};

export default Wallets;
