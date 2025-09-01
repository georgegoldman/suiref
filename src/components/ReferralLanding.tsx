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
      <div className="flex items-start justify-between min-h-screen">
        <div
          className="w-full h-screen flex justify-center rounded-tr-[20px] rounded-br-[20px] sticky top-0"
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

        <div className="w-full flex flex-col gap-16 items-center mx-[2rem] ml-[3rem] py-8 self-center">
          <div className="flex flex-col gap-[10px] items-center">
            <h2 className="text-[40px] font-bold text-center text-white">
              Welcome to SuiHub!
            </h2>
            <p className="text-white/60 text-[20px] font-medium text-center">
              Join our community and start earning rewards
            </p>
          </div>

          <Link
            to="/login"
            className="bg-[#E8E8E8] py-[10px] px-[20px] rounded-[10px] text-sm font-medium text-[#040C33] w-[356px] h-[54px] flex items-center justify-center"
          >
            Get Started
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between min-h-screen">
      <div
        className="w-full h-screen flex justify-center rounded-tr-[20px] rounded-br-[20px] sticky top-0"
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

      <div className="flex flex-col w-full gap-[112px] items-center mx-[2rem] ml-[3rem] py-8 self-center">
        <div className="flex flex-col gap-[10px]">
          <div className="flex items-start gap-[5px]">
            {/* <img width={30} height={30} src={PartyHat} alt="Party Hat" /> */}
            <h2 className="text-[40px] font-bold text-center">
              You’ve been invited by{" "}
              <span className="text-[#4DA2FD]">zkdev18</span> to join SuiHub
            </h2>
          </div>
          <p className="text-white/60 text-[20px] font-medium text-center">Earn rewards, NFTs and access to exclusive bootcamps.</p>
        </div>

        <Link to="/login" className="bg-[#E8E8E8] py-[10px] px-[20px] rounded-[10px] text-sm font-medium text-[#040C33] w-[356px] h-[54px] flex items-center justify-center">
            Get Started
        </Link>
      </div>
    </div>
  );
};

export default ReferralLanding;
