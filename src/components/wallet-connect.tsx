import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {  ConnectModal, useCurrentAccount } from "@mysten/dapp-kit";
import OnboardImage from "../assets/about-our-team (1).svg";
import '@mysten/dapp-kit/dist/index.css';


const WalletConnect = () => {
  const navigate = useNavigate();
  const currentAccount = useCurrentAccount();
  const [open, setOpen] = useState(false);


  useEffect(() => {
    if (currentAccount) navigate("/dashboard", { replace: true });
  }, [currentAccount, navigate]);

  return (
    <div className="flex items-center justify-between h-screen">
      {/* left pane */}
      <div className="w-full h-full flex justify-center rounded-[20px]"
           style={{ background: "linear-gradient(158.16deg, rgba(119,114,243,0.7) -36.07%, #4DA2FD 119.81%)" }}>
        <img src={OnboardImage} alt="Onboard" width={371} height={371} className="object-contain" />
      </div>

      {/* right pane */}
      <div className="flex flex-col items-center justify-center gap-6 p-5 bg-[#FFFFFF14] border border-[#4DA2FD70] rounded-2xl w-full max-w-[607px] backdrop-blur-sm mx-[2rem] ml-[3rem]">
        <div className="flex flex-col items-center gap-3 text-center">
          <h3 className="font-bold text-[40px] text-white leading-tight">
            {currentAccount ? "You’re connected" : "Connect Wallet"}
          </h3>
          <p className="font-medium text-[20px] text-[#FFFFFFB2] px-2 max-w-md leading-relaxed">
            We'll use this wallet to airdrop your reward and track your participation.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 w-full">
          {/* <ConnectButton className="bg-[#4DA2FD] w-full h-[72px] rounded-[20px] font-bold text-2xl text-white hover:bg-[#3d8ae6] active:bg-[#2d7acc] disabled:opacity-75 transition-all" /> */}
          {/* Mount the modal ONCE, with no props → stays UNcontrolled */}
          <ConnectModal
            open={open}
            onOpenChange={setOpen}
            trigger={
              <button
                onClick={() => setOpen(true)}
                className="bg-[#4DA2FD] w-full h-[72px] rounded-[20px] font-bold text-2xl text-white"
              >
                Connect wallet
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default WalletConnect;
// function useState(arg0: boolean): [any, any] {
//   throw new Error("Function not implemented.");
// }

