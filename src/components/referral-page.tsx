import { useMemo, useState } from "react";
import OnboardImage from "../assets/about-our-team (1).svg";
import { useCurrentAccount } from "@mysten/dapp-kit";
import CopyBlack from "../assets/copy-01";
import ShareIconBlack from "../assets/share-icon-black";
import QrCode from "../assets/qr-code.svg";
import ShareIconWhite from "../assets/share-icon-white";

const ReferralPage = () => {
  const [isLinkGenerated, setIsLinkGenerated] = useState(false);
  const account = useCurrentAccount();

  // Build referral link from connected address
  const referralLink = useMemo(() => {
    if (!account?.address) return "";
    return `${window.location.origin}/onboard?ref=${account.address}`;
  }, [account?.address]);

  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    if (!referralLink) return;
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleWebShare = async () => {
    if (!referralLink) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join SuiHub",
          text: "Use my referral link to join SuiHub",
          url: referralLink,
        });
      } catch {
        await handleCopy();
      }
    } else {
      await handleCopy();
    }
  };
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

      <div className="flex flex-col gap-16 items-center mx-[2rem] ml-[3rem] py-8 self-center">
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
        {isLinkGenerated ? (
          <div className="flex flex-col items-center">
            <div className="flex flex-col p-[20px] w-[390px] rounded-[20px] gap-4 sm:gap-6 lg:gap-[15px]">
              <h3 className="text-sm font-medium">Referral Link</h3>
              <div className="flex gap-3 sm:gap-4 lg:gap-5 w-full">
                <input
                  placeholder="Generating referral link"
                  type="text"
                  value={referralLink}
                  readOnly
                  className="border border-white/20 bg-transparent py-2.5 px-5 sm:px-4 lg:px-5 rounded-[10px] w-full font-medium text-xs text-white/70 h-[54px]"
                />
                <button
                  onClick={handleCopy}
                  disabled={!referralLink}
                  className="bg-[#E8E8E8] py-2.5 px-2.5 sm:px-5 rounded-[10px] h-12 sm:h-[54px] w-12 sm:w-[54px] flex items-center justify-center shrink-0"
                  title={
                    referralLink ? "Copy link" : "Connect wallet to get link"
                  }
                >
                  <CopyBlack />
                </button>
              </div>

              <button
                onClick={handleWebShare}
                disabled={!referralLink}
                className="bg-[#E8E8E8] py-2.5 px-5 rounded-[10px] w-full h-12 sm:h-[54px] text-[#040C33] text-sm font-medium flex items-center justify-center gap-2 lg:gap-[10px]"
                title={referralLink ? "Share link" : "Connect wallet to share"}
              >
                <ShareIconBlack />
                <span>{copied ? "Copied!" : "Share"}</span>
              </button>
            </div>

            <p className="text-[#FFFFFF] font-bold text-[20px]">Or</p>

            <div className="flex flex-col items-center gap-3 sm:gap-4 lg:gap-[20px] w-[390px] p-[20px] rounded-[20px]">
              <h3 className="text-base font-medium">QR Code</h3>

              <p className="text-sm text-[#FFFFFFB2] font-medium text-center">
                Scan or Share referral code
              </p>

              <div className="w-32 sm:w-40 lg:w-auto">
                <img src={QrCode} alt="Referral QR" className="w-full" />
              </div>

              <div className="flex items-center gap-3 sm:gap-4 lg:gap-[20px] w-full">
                <button className="bg-[#E8E8E8] py-2.5 px-3 sm:px-5 rounded-[10px] flex-1 h-12 sm:h-[54px] text-[#040C33CC] border border-white/20 text-xs sm:text-sm font-medium flex items-center justify-center">
                  Download QR Code
                </button>

                <button className="border-white/50 border py-2.5 px-2.5 sm:px-5 rounded-[10px] h-12 sm:h-[54px] w-12 sm:w-[54px] flex items-center justify-center shrink-0">
                  <ShareIconWhite />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsLinkGenerated(true)}
            className="bg-[#E8E8E8] py-[10px] px-[20px] rounded-[10px] text-sm font-medium text-[#040C33] w-[356px] h-[54px]"
          >
            Generate Link
          </button>
        )}
      </div>
    </div>
  );
};

export default ReferralPage;
