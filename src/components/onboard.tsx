import { useNavigate } from "react-router-dom";
import OnboardImage from "../assets/about-our-team (1).svg";

const Onboard = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  const handleLeaderboardRedirect = () => {
    navigate("/leaderboard");
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start w-full min-h-screen lg:h-screen gap-6 lg:gap-0 pb-4 lg:py-0">
      <div
        className="w-full h-full flex justify-center items-center px-4 py-8 sm:py-10 lg:rounded-tr-[20px] lg:rounded-bl-[0px] rounded-bl-[20px] rounded-br-[20px]"
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
          className="object-contain w-full max-w-[320px] sm:max-w-[380px] h-auto"
        />
      </div>

      <div className="w-full flex flex-col justify-center gap-[clamp(2rem,5vw,6.25rem)] px-[clamp(1rem,5vw,4rem)] self-center">
        <div className="flex flex-col items-center lg:items-start gap-[clamp(1rem,2vw,2.5rem)] text-center lg:text-left">
          <h2 className="font-bold text-[clamp(1.5rem,4vw,2.5rem)] leading-snug text-white text-center">
            Earn Onchain Rewards by Growing the Sui Developer Community
          </h2>
          <p className="text-white/60 text-center font-medium text-[clamp(0.875rem,2vw,1.25rem)] max-w-prose leading-relaxed">
            Refer Developers, Unlock NFTs, and climb the leaderboard. All
            onchain, all private.
          </p>
        </div>

        <div className="flex flex-col gap-[clamp(1rem,2vw,1.5rem)]">
          <div className="flex gap-[clamp(1rem,2vw,1.5rem)] w-full max-w-md lg:max-w-none mx-auto lg:mx-0">
            <button
              onClick={handleGetStarted}
              className="bg-[#4DA2FD] hover:bg-[#3d8ae6] py-[clamp(0.75rem,1.5vw,1.25rem)] rounded-[clamp(0.75rem,2vw,1.25rem)] text-[clamp(0.875rem,2vw,1.125rem)] font-bold w-full text-white transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started
            </button>
            <button className="bg-[#1F5793B2] hover:bg-[#1F5793CC] border border-[#1F579350] py-[clamp(0.75rem,1.5vw,1.25rem)] rounded-[clamp(0.75rem,2vw,1.25rem)] text-[clamp(0.875rem,2vw,1.125rem)] font-bold w-full text-white transition-colors duration-200">
              Learn More
            </button>
          </div>

          <button
            onClick={handleLeaderboardRedirect}
            className="border border-[#4DA2FDC4] py-[clamp(0.75rem,1.5vw,1.25rem)] rounded-[clamp(0.75rem,2vw,1.25rem)] text-[clamp(0.875rem,2vw,1.125rem)] font-bold w-full text-white"
          >
            View Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboard;
