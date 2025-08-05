import { useNavigate } from "react-router-dom";
import OnboardImage from "../assets/about-our-team.svg";

const Onboard = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  const handleLearnMore = () => {};
  
  return (
    <div className="flex flex-col lg:flex-row justify-between items-center w-full min-h-screen px-[clamp(1rem,5vw,4rem)] py-4 lg:py-0">
      <div className="w-full lg:w-[45%] flex justify-center lg:justify-start">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-none">
          <img
            src={OnboardImage}
            alt="Onboard Image"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      <div className="w-full lg:w-[45%] flex flex-col justify-center gap-[clamp(2rem,5vw,6.25rem)] py-[clamp(1rem,5vh,2rem)] lg:py-[clamp(2rem,5vh,4rem)]">
        <div className="flex flex-col items-center lg:items-start gap-[clamp(1rem,2vw,2.5rem)] text-center lg:text-left">
          <h2 className="font-bold text-[clamp(1.5rem,4vw,2.5rem)] leading-snug text-white text-center">
            Earn Onchain Rewards by Growing the Sui Developer Community
          </h2>
          <p className="text-white/60 text-center font-medium text-[clamp(0.875rem,2vw,1.25rem)] max-w-prose leading-relaxed">
            Refer Developers, Unlock NFTs, and climb the leaderboard. All
            onchain, all private.
          </p>
        </div>

        <div className="flex flex-col gap-[clamp(1rem,2vw,1.5rem)] w-full max-w-md lg:max-w-none mx-auto lg:mx-0">
          <button
            onClick={handleGetStarted}
            className="bg-[#4DA2FD] hover:bg-[#3d8ae6] py-[clamp(0.75rem,1.5vw,1.25rem)] rounded-[clamp(0.75rem,2vw,1.25rem)] text-[clamp(0.875rem,2vw,1.125rem)] font-bold w-full text-white transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Get Started
          </button>
          <button
            onClick={handleLearnMore}
            className="bg-[#1F5793B2] hover:bg-[#1F5793CC] border border-[#1F579350] py-[clamp(0.75rem,1.5vw,1.25rem)] rounded-[clamp(0.75rem,2vw,1.25rem)] text-[clamp(0.875rem,2vw,1.125rem)] font-bold w-full text-white transition-colors duration-200"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboard;