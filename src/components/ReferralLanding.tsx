import { useSearchParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import OnboardImage from "../assets/about-our-team (1).svg";
import PartyHat from "../assets/party-hat.png";

const ReferralLanding = () => {
  const [searchParams] = useSearchParams();
  const [referrerAddress, setReferrerAddress] = useState<string>("tt");
  const [shortenedAddress, setShortenedAddress] = useState<string>("");

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      setReferrerAddress(ref);
      setShortenedAddress(`${ref.slice(0, 6)}...${ref.slice(-4)}`);
    }
  }, [searchParams]);

  if (!referrerAddress) {
    return (
      <div className="flex flex-col lg:flex-row justify-between items-start w-full min-h-[100dvh] py-0">
        <div
          className="w-full h-[55dvh] sm:h-[60dvh] lg:h-[100dvh] flex justify-center items-center rounded-b-[20px] lg:rounded-b-none lg:rounded-tr-[20px] lg:rounded-br-[20px] lg:sticky lg:top-0"
          style={{
            background:
              "linear-gradient(158.16deg, rgba(119, 114, 243, 0.7) -36.07%, #4DA2FD 119.81%)",
          }}
        >
          <img
            src={OnboardImage}
            alt="Onboard illustration"
            className="object-contain w-full max-w-[420px] h-auto"
          />
        </div>

        <div className="w-full flex flex-col items-center justify-center gap-[clamp(2rem,5vw,6.25rem)] px-4 sm:px-6 lg:px-16 self-center mt-6 lg:mt-0">
          <div className="flex flex-col gap-[clamp(0.5rem,2vw,1rem)] items-center text-center">
            <h2 className="text-[clamp(1.5rem,4vw,2.5rem)] font-bold text-white">
              Welcome to SuiHub!
            </h2>
            <p className="text-white/60 text-[clamp(0.875rem,2.5vw,1.25rem)] font-medium">
              Join our community and start earning rewards
            </p>
          </div>

          <Link
            to="/login"
            className="bg-[#E8E8E8] py-[10px] px-[20px] rounded-[10px] text-sm font-medium text-[#040C33] w-full max-w-[356px] h-[54px] flex items-center justify-center"
          >
            Get Started
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start w-full min-h-[100dvh] py-0">
      <div
        className="w-full h-[55dvh] sm:h-[60dvh] lg:h-[100dvh] flex justify-center items-center rounded-b-[20px] lg:rounded-b-none lg:rounded-tr-[20px] lg:rounded-br-[20px] lg:sticky lg:top-0"
        style={{
          background:
            "linear-gradient(158.16deg, rgba(119, 114, 243, 0.7) -36.07%, #4DA2FD 119.81%)",
        }}
      >
        <img
          src={OnboardImage}
          alt="Onboard illustration"
          className="object-contain w-full max-w-[420px] h-auto"
        />
      </div>

      <div className="flex flex-col w-full items-center justify-center gap-[clamp(2rem,5vw,6.25rem)] px-4 sm:px-6 lg:px-16 self-center mt-6 lg:mt-0">
        <div className="flex flex-col gap-[clamp(0.5rem,2vw,1rem)] items-center text-center">
          <div className="flex items-start gap-[5px]">
            {/* <img width={30} height={30} src={PartyHat} alt="Party Hat" /> */}
            <h2 className="text-[clamp(1.5rem,4vw,2.5rem)] font-bold text-center">
              You’ve been invited by{" "}
              <span className="text-[#4DA2FD]">zkdev18</span> to join SuiHub
            </h2>
          </div>
          <p className="text-white/60 text-[clamp(0.875rem,2.5vw,1.25rem)] font-medium text-center">Earn rewards, NFTs and access to exclusive bootcamps.</p>
        </div>

        <Link to="/login" className="bg-[#E8E8E8] py-[10px] px-[20px] rounded-[10px] text-sm font-medium text-[#040C33] w-full max-w-[356px] h-[54px] flex items-center justify-center">
            Get Started
        </Link>
      </div>
    </div>
  );
};

export default ReferralLanding;
