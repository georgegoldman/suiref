import OnboardImage from "../assets/about-our-team (1).svg";
const ReferralPage = () => {
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

      <div className="flex flex-col justify-between items-center mx-[2rem] ml-[3rem] h-[390px]">
        <div className="flex flex-col gap-[10px] items-center">
          <div className="flex items-start gap-[5px]">
            <h2 className="text-[40px] font-bold text-center">
              You’re all set, let the referral begins!
            </h2>
          </div>
          <p className="text-white/60 text-[20px] font-medium text-center">
            Invite your friends to join SuiHub, attend workshop and join
            complete onboardings module. Earn points and unlock NFT rewards
          </p>
        </div>
        <button className="bg-[#E8E8E8] py-[10px] px-[20px] rounded-[10px] text-sm font-medium text-[#040C33] w-[356px] h-[54px]">
            Generate Link
        </button>
      </div>
    </div>
  );
};

export default ReferralPage;
