import { useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import DashbaordCoin from "../assets/dashbaord-coin";
import NFTImage from "../assets/demo-nft.svg";

const Wallets = () => {
  const [activeTab, setActiveTab] = useState("token");
  return (
    <div className="flex-1 flex flex-col gap-8 p-4 sm:p-6">
      <div className="flex flex-col gap-2.5">
        <h3 className="font-bold text-2xl">Wallet</h3>
        <p className="text-xs font-medium text-white/60">
          Connect your sui compactible wallet to receive rewards and NFTs
        </p>
      </div>

      <div className="flex flex-col gap-12 bg-[#4DA2FD] rounded-[20px] lg:w-[325px] p-4">
        <div className="flex flex-col gap-2.5">
          <h5 className="text-sm font-normal text-white/70">Balance</h5>
          <p className="text-[2rem] font-medium">$0.00</p>
        </div>
        <p className="text-sm font-normal text-white/90">-$0.00 -0.00</p>
      </div>

      <div className="flex items-center gap-8">
        <button className="bg-[#4DA2FD] rounded-[15px] flex items-center justify-center gap-2.5 max-w-[507px] py-4 w-full">
          <HiOutlinePlus />
          <p className="text-xs font-normal">Send</p>
        </button>
        <button className="bg-[#4DA2FD] rounded-[15px] flex items-center justify-center gap-2.5 max-w-[507px] py-4 w-full">
          <HiOutlinePlus />
          <p className="text-xs font-normal">Receive</p>
        </button>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-8">
          <button
            className={`text-base font-medium ${
              activeTab === "token" ? "text-white" : "text-white/40"
            }`}
            onClick={() => setActiveTab("token")}
          >
            Token
          </button>
          <button
            className={`text-base font-medium ${
              activeTab === "nfts" ? "text-white" : "text-white/40"
            }`}
            onClick={() => setActiveTab("nfts")}
          >
            NFTs
          </button>
        </div>
        <div className="border-t border-white/10 pt-5">
          {activeTab === "token" && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <DashbaordCoin />
                  <p className="text-base font-medium text-white">Coin</p>
                </div>

                <p className="text-base font-medium text-white/60">5 Coin</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <DashbaordCoin />
                  <p className="text-base font-medium text-white">Coin</p>
                </div>

                <p className="text-base font-medium text-white/60">5 Coin</p>
              </div>
            </div>
          )}
          {activeTab === "nfts" && (
            <div className="flex flex-col gap-5">
              <p className="text-base font-medium text-white/60">$90.56</p>

              <div className="w-[200px] h-[200px]">
                <img
                  src={NFTImage}
                  alt="NFT"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallets;
