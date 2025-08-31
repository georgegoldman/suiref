import TeamImage from "../assets/about-our-team (1).svg";
const ReferralTools = () => {
  return (
    <div className="relative w-full h-full">
      <div className="flex flex-col items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <img src={TeamImage} alt="Team Image" className="" />
        <h4 className="font-bold text-[32px]">Go Coming Soon!</h4>
      </div>
    </div>
  );
};

export default ReferralTools;
