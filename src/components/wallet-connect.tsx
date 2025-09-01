import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import SuccessIcon from "../assets/icon-success";
import IconError from "../assets/icon-error";
import { useNavigate } from "react-router-dom";
import OnboardImage from "../assets/about-our-team (1).svg";

type WalletConnectProps = {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};
const WalletConnect = ({
  setIsAuthenticated,
}: WalletConnectProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasError] = useState(false); // Set to true when there is an error to see the error state
  const navigate = useNavigate();

  const handleWalletConnect = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 3000);
  };

  useEffect(() => {
    if (isSuccess) {
      setIsAuthenticated(true);
      const timer = setTimeout(() => {
        navigate("/dashboard");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate, setIsAuthenticated]);

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
        {isSuccess ? (
          <div className="flex flex-col items-center gap-6 sm:gap-7 md:gap-8 lg:gap-[30px]">
            <div className="scale-75 sm:scale-90 md:scale-100">
              <SuccessIcon />
            </div>
            <div className="flex flex-col items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-[10px] text-center">
              <h3 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-[40px] text-[#fff] leading-tight">
                Successful!
              </h3>
              <p className="font-medium text-sm sm:text-base md:text-lg lg:text-[20px] text-[#FFFFFFB2] px-2 max-w-sm leading-relaxed">
                Wallet connected:{" "}
                <span className="font-mono text-[#4DA2FD]">0xB4...82cF</span>
              </p>
            </div>
          </div>
        ) : hasError ? (
          <div className="flex flex-col items-center gap-6 sm:gap-7 md:gap-8 lg:gap-[30px]">
            <div className="scale-75 sm:scale-90 md:scale-100">
              <IconError />
            </div>
            <div className="flex flex-col items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-[10px] text-center">
              <h3 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-[40px] text-[#FF3D3D] leading-tight">
                Connection Failed
              </h3>
              <p className="font-medium text-sm sm:text-base md:text-lg lg:text-[20px] text-[#FFFFFFB2] px-2 max-w-md leading-relaxed">
                No wallet connected yet.{" "}
                <span className="text-[#4DA2FD] cursor-pointer hover:text-[#3d8ae6] transition-colors underline">
                  Try Again
                </span>
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-5 lg:gap-[20px] text-center">
              <h3 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-[40px] text-[#fff] leading-tight">
                Connect Wallet
              </h3>
              <p className="font-medium text-sm sm:text-base md:text-lg lg:text-[20px] text-[#FFFFFFB2] px-2 max-w-md leading-relaxed">
                We'll use this wallet to airdrop your reward and track your
                participation.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-5 lg:gap-[20px] w-full">
              <button
                onClick={handleWalletConnect}
                disabled={isLoading}
                className="bg-[#4DA2FD] w-full py-3 sm:py-3.5 md:py-4 lg:py-[10px] h-11 sm:h-12 md:h-16 lg:h-[72px] rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-[20px] font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-white hover:bg-[#3d8ae6] active:bg-[#2d7acc] disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex gap-2 sm:gap-2.5 md:gap-3 lg:gap-[10px] items-center justify-center">
                    <AiOutlineLoading3Quarters className="animate-spin text-white text-sm sm:text-base md:text-lg lg:text-xl" />
                    <span className="text-sm sm:text-base md:text-lg lg:text-lg">
                      Connecting...
                    </span>
                  </div>
                ) : (
                  "Connect Wallet"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WalletConnect;
