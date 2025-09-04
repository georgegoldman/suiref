// src/components/login.tsx
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  useConnectWallet,
  useCurrentAccount,
  useWallets,
  useDisconnectWallet,
} from "@mysten/dapp-kit";
import {
  isEnokiWallet,
  type AuthProvider,
  type EnokiWallet,
} from "@mysten/enoki";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import OnboardImage from "../assets/about-our-team (1).svg";

const Login = () => {
  const navigate = useNavigate();
  const currentAccount = useCurrentAccount();

  const { mutateAsync: connectAsync, isPending: isConnecting } =
    useConnectWallet();
  const { mutateAsync: disconnectAsync, isPending: isDisconnecting } =
    useDisconnectWallet();

  // Enoki wallets (google, facebook, twitch)
  const wallets = useWallets().filter(isEnokiWallet);
  const walletsByProvider = useMemo(
    () =>
      wallets.reduce<Map<AuthProvider, EnokiWallet>>(
        (map, wallet) => map.set(wallet.provider, wallet),
        new Map<AuthProvider, EnokiWallet>()
      ),
    [wallets]
  );
  const googleWallet = walletsByProvider.get("google");

  // ✅ If already connected, go straight to dashboard (prevents flicker)
  useEffect(() => {
    if (currentAccount) {
      navigate("/dashboard", { replace: true });
    }
  }, [currentAccount, navigate]);

  const handleConnect = async (wallet?: EnokiWallet) => {
    if (!wallet) return;
    try {
      await connectAsync({ wallet }); // opens Enoki popup
      navigate("/dashboard", { replace: true }); // go forward once connected
    } catch (e) {
      console.error("Google login failed:", e);
    }
  };

  const handleLogout = async () => {
    try {
      await disconnectAsync();
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between min-h-screen lg:h-screen">
      <div
        className="w-full lg:w-1/2 h-64 sm:h-80 md:h-96 lg:h-full flex justify-center items-center px-4 py-8 lg:py-0 lg:rounded-tr-[20px] lg:rounded-br-[20px]"
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
          className="object-contain w-full max-w-[280px] sm:max-w-[320px] md:max-w-[350px] lg:max-w-[371px] h-auto"
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-[60px] p-4 sm:p-6 md:p-8 lg:p-[20px] bg-[#FFFFFF14] border border-[#4DA2FD70] rounded-2xl md:rounded-3xl lg:rounded-[30px] lg:w-1/2 backdrop-blur-sm mx-4 sm:mx-6 md:mx-8 lg:mx-[2rem] lg:ml-[3rem] my-6 lg:my-0">
        <>
          <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-5 lg:gap-[20px] text-center">
            <h3 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-[40px] text-[#fff] leading-tight">
              {currentAccount ? "You’re logged in" : "Login"}
            </h3>
            <p className="font-medium text-sm sm:text-base md:text-lg lg:text-[20px] text-[#FFFFFFB2] px-2 max-w-md leading-relaxed">
              Login securely with Zero Knowledge Authentication
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-5 lg:gap-[20px] w-full">
            {!currentAccount ? (
              googleWallet ? (
                <button
                  type="button"
                  onClick={() => handleConnect(googleWallet)}
                  disabled={isConnecting}
                  className="bg-[#4DA2FD] w-full py-3 sm:py-3.5 md:py-4 lg:py-[10px] h-11 sm:h-12 md:h-16 lg:h-[72px] rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-[20px] font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-white hover:bg-[#3d8ae6] active:bg-[#2d7acc] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isConnecting ? (
                    <div className="flex gap-2 sm:gap-2.5 md:gap-3 lg:gap-[10px] items-center justify-center">
                      <AiOutlineLoading3Quarters className="animate-spin text-white text-sm sm:text-base md:text-lg lg:text-xl" />
                      <span className="text-sm sm:text-base md:text-lg lg:text-lg">
                        Connecting…
                      </span>
                    </div>
                  ) : (
                    "Sign in with Google"
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="opacity-60 cursor-not-allowed bg-gray-500 w-full py-3 sm:py-3.5 md:py-4 lg:py-[10px] h-11 sm:h-12 md:h-16 lg:h-[72px] rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-[20px] font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-white"
                  title="Google login unavailable. Did you register Enoki and set VITE_ENOKI_API_KEY / VITE_GOOGLE_CLIENT_ID?"
                >
                  Sign in with Google
                </button>
              )
            ) : (
              <>
                <div className="text-[#FFFFFFB2] text-sm sm:text-base break-all text-center">
                  Current address:
                  <div className="font-mono text-white mt-1">
                    {currentAccount.address}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isDisconnecting}
                  className="bg-[#EF4444] w-full py-3 sm:py-3.5 md:py-4 lg:py-[10px] h-11 sm:h-12 md:h-16 lg:h-[72px] rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-[20px] font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-white hover:bg-[#dc2626] active:bg-[#b91c1c] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isDisconnecting ? "Disconnecting…" : "Logout"}
                </button>
              </>
            )}

            <p className="font-medium text-xs sm:text-sm md:text-sm lg:text-[14px] text-[#FFFFFFB2] text-center px-2 w-full leading-relaxed">
              We use ZK login to verify identity without storing your personal
              data
            </p>
          </div>
        </>
      </div>
    </div>
  );
};

export default Login;
