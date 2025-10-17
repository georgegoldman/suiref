import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import OnboardImage from "../assets/about-our-team (1).svg";

const WalletConnect = () => {
  const navigate = useNavigate();
  const currentAccount = useCurrentAccount();

  useEffect(() => {
    if (currentAccount) {
      navigate("/dashboard", { replace: true });
    }
  }, [currentAccount, navigate]);

  return (
    <div className="flex items-center justify-between h-screen">
      <div
        className="w-full h-full flex justify-center rounded-[20px]"
        style={{
          background:
            "linear-gradient(158.16deg, rgba(119, 114, 243, 0.7) -36.07%, #4DA2FD 119.81%)",
        }}
      >
        <img
          src={OnboardImage}
          alt="Onboard Image"
          width={371}
          height={371}
          className="object-contain"
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-[60px] p-5 sm:p-6 md:p-8 lg:p-[20px] bg-[#FFFFFF14] border border-[#4DA2FD70] rounded-2xl md:rounded-3xl lg:rounded-[30px] w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-[607px] backdrop-blur-sm mx-[2rem] ml-[3rem]">
        <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-5 lg:gap-[20px] text-center">
          <h3 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-[40px] text-[#fff] leading-tight">
            {currentAccount ? "You’re connected" : "Connect Wallet"}
          </h3>
          <p className="font-medium text-sm sm:text-base md:text-lg lg:text-[20px] text-[#FFFFFFB2] px-2 max-w-md leading-relaxed">
            We'll use this wallet to airdrop your reward and track your
            participation.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-5 lg:gap-[20px] w-full">
          <ConnectButton className="bg-[#4DA2FD] w-full py-3 sm:py-3.5 md:py-4 lg:py-[10px] h-11 sm:h-12 md:h-16 lg:h-[72px] rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-[20px] font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-white hover:bg-[#3d8ae6] active:bg-[#2d7acc] disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-200" />
        </div>
      </div>
    </div>
  );
};

export default WalletConnect;
