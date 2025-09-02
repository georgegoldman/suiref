import TeamImage from "../assets/about-our-team (1).svg";
const ReferralTools = () => {
  return (
    <div className="relative w-full h-full min-h-[50vh]">
      <div className="flex flex-col items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 text-center">
        <img src={TeamImage} alt="Team Image" className="w-full max-w-[clamp(16rem,80vw,26.25rem)] h-auto" />
        <h4 className="font-bold text-[1.5rem] sm:text-[1.75rem] lg:text-[2rem] mt-4">Go Coming Soon!</h4>
      </div>
    </div>
  );
};

export default ReferralTools;
