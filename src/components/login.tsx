import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import SuccessIcon from "../assets/icon-success";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 3000);
  };

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate("/wallet-connect");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="flex flex-col items-center justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-[60px] p-5 sm:p-6 md:p-8 lg:p-[20px] bg-[#FFFFFF14] border border-[#4DA2FD70] rounded-2xl md:rounded-3xl lg:rounded-[30px] w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-[607px] backdrop-blur-sm">
        {isSuccess ? (
          <div className="flex flex-col items-center gap-6 sm:gap-7 md:gap-8 lg:gap-[30px]">
            <div className="scale-75 sm:scale-90 md:scale-100">
              <SuccessIcon />
            </div>
            <div className="flex flex-col items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-[10px] text-center">
              <h3 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-[40px] text-[#fff] leading-tight">
                Successful
              </h3>
              <p className="font-medium text-sm sm:text-base md:text-lg lg:text-[20px] text-[#FFFFFFB2] px-2 max-w-sm leading-relaxed">
                You've successfully logged in.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-5 lg:gap-[20px] text-center">
              <h3 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-[40px] text-[#fff] leading-tight">
                Login
              </h3>
              <p className="font-medium text-sm sm:text-base md:text-lg lg:text-[20px] text-[#FFFFFFB2] px-2 max-w-md leading-relaxed">
                Login securely with Zero Knowledge Authentication
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-5 lg:gap-[20px] w-full">
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="bg-[#4DA2FD] w-full py-3 sm:py-3.5 md:py-4 lg:py-[10px] h-11 sm:h-12 md:h-16 lg:h-[72px] rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-[20px] font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-white hover:bg-[#3d8ae6] active:bg-[#2d7acc]"
              >
                {isLoading ? (
                  <div className="flex gap-2 sm:gap-2.5 md:gap-3 lg:gap-[10px] items-center justify-center">
                    <AiOutlineLoading3Quarters className="animate-spin text-white text-sm sm:text-base md:text-lg lg:text-xl" />
                    <span className="text-sm sm:text-base md:text-lg lg:text-lg">
                      Please wait...
                    </span>
                  </div>
                ) : (
                  "Login With ZK"
                )}
              </button>
              <p className="font-medium text-xs sm:text-sm md:text-sm lg:text-[14px] text-[#FFFFFFB2] text-center px-2 max-w-sm leading-relaxed">
                We use ZK login to verify identity without storing your personal
                data
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
