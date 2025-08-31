import WhiteShare from "../assets/white-share";
import ShareIcon from "../assets/share-08";
import CopyIcon from "../assets/copy-icon";
import QrCode from "../assets/qr-code.svg";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useMemo, useState } from "react";
const ReferralComponent = () => {
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
    <div className="flex items-start justify-between">
      {/* Referral Link Section */}
      <div className="flex flex-col border border-[#4DA2FD] p-[20px] w-[390px] rounded-[20px] gap-4 sm:gap-6 lg:gap-[15px]">
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
            className="bg-[#4DA2FD] py-2.5 px-2.5 sm:px-5 rounded-[10px] h-12 sm:h-[54px] w-12 sm:w-[54px] flex items-center justify-center shrink-0 disabled:opacity-60"
            title={referralLink ? "Copy link" : "Connect wallet to get link"}
          >
            <CopyIcon />
          </button>
        </div>

        <button
          onClick={handleWebShare}
          disabled={!referralLink}
          className="bg-[#4DA2FD] py-2.5 px-5 rounded-[10px] w-full h-12 sm:h-[54px] text-[#fff] text-sm font-medium flex items-center justify-center gap-2 lg:gap-[10px] disabled:opacity-60"
          title={referralLink ? "Share link" : "Connect wallet to share"}
        >
          <ShareIcon />
          <span>{copied ? "Copied!" : "Share"}</span>
        </button>
      </div>

      {/* <div className="flex items-center gap-[116px]">

            </div> */}

      <div className="flex items-center justify-center self-center w-full lg:w-auto">
        <div className="flex-1 lg:hidden h-px bg-[#FFFFFF33]"></div>
        <p className="mx-4 lg:mx-0 text-[#FFFFFF] font-bold text-[20px]">Or</p>
        <div className="flex-1 lg:hidden h-px bg-[#FFFFFF33]"></div>
      </div>

      {/* QR Code Section */}
      <div className="flex flex-col items-center gap-3 sm:gap-4 lg:gap-[20px] w-[390px] border border-[#4DA2FD] p-[20px] rounded-[20px]">
        <h3 className="text-base font-medium">QR Code</h3>

        <div className="w-32 sm:w-40 lg:w-auto">
          <img src={QrCode} alt="Referral QR" className="w-full" />
        </div>

        <p className="text-sm text-[#FFFFFFB2] font-medium text-center">
          Scan or Share referral code
        </p>

        <div className="flex items-center gap-3 sm:gap-4 lg:gap-[20px] w-full">
          <button className="bg-[#4DA2FD] py-2.5 px-3 sm:px-5 rounded-[10px] flex-1 h-12 sm:h-[54px] text-[#fff] border border-white/20 text-xs sm:text-sm font-medium flex items-center justify-center">
            Download QR Code
          </button>

          <button className="border-[#4DA2FD] border py-2.5 px-2.5 sm:px-5 rounded-[10px] h-12 sm:h-[54px] w-12 sm:w-[54px] flex items-center justify-center shrink-0">
            <WhiteShare />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferralComponent;
