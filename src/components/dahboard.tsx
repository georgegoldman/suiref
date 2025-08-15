/* eslint-disable no-empty */
// src/components/dahboard.tsx
// Pure UI + logout; auth is handled by route guards and /auth callback.

import WelcomeImage from "../assets/about-our-team.svg";
import CopyIcon from "../assets/copy-icon";
import ShareIcon from "../assets/share-08";
import QrCode from "../assets/qr-code.svg";
import WhiteShare from "../assets/white-share";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentAccount, useDisconnectWallet } from "@mysten/dapp-kit";

type ReferralDataType = { title: string; value: number };

export default function Dashboard() {
  const account = useCurrentAccount();
  const navigate = useNavigate();
  const { mutateAsync: disconnectAsync, isPending: isDisconnecting } = useDisconnectWallet();

  const handleLogout = async () => {
    try {
      await disconnectAsync();
    } finally {
      // In case you ever stored an id_token:
      sessionStorage.removeItem("sui_jwt_token");
      navigate("/login", { replace: true });
    }
  };

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
      } catch {}
    } else {
      await handleCopy();
    }
  };

  const ReferralData: ReferralDataType[] = [
    { title: "Total Referrals", value: 10 },
    { title: "Total Points", value: 100 },
    { title: "Module Completers", value: 5 },
    { title: "Workshop Attendance", value: 10 },
  ];

  return (
    <div className="min-h-screen bg-[#040c33] text-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Top bar with Logout */}
        <div className="flex items-center justify-end mb-4">
          <button
            onClick={handleLogout}
            disabled={isDisconnecting}
            className="bg-[#EF4444] hover:bg-[#dc2626] active:bg-[#b91c1c] disabled:opacity-70 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium"
            title="Logout"
          >
            {isDisconnecting ? "Logging out…" : "Logout"}
          </button>
        </div>

        {/* Header Section */}
        <div className="flex flex-col items-center relative mb-8 sm:mb-12">
          <div className="w-full max-w-[200px] sm:max-w-[280px] lg:max-w-[353px] mb-10 ">
            <img src={WelcomeImage} className="w-full" alt="Welcome" />
          </div>

          <div className="mt-[-10%] sm:mt-[-12%] flex flex-col items-center gap-2 sm:gap-3 lg:gap-[10px] px-4">
            <h1 className="text-xl sm:text-2xl lg:text-[40px] font-bold text-center leading-tight">
              You&apos;re all set, let the referrals begin!
            </h1>
            <p className="text-sm sm:text-lg lg:text-2xl font-medium text-center text-[#FFFFFF99] max-w-4xl">
              Invite your friends to join SuiHub, attend workshops, and complete onboarding modules. Earn points and unlock NFT rewards.
            </p>
            {account?.address && (
              <p className="text-xs sm:text-sm text-[#FFFFFF80] font-mono break-all mt-2 text-center">
                Address: {account.address}
              </p>
            )}
          </div>
        </div>

        {/* Referral Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 sm:gap-8 lg:gap-[40px] mb-8 sm:mb-12">
          {/* Referral Link Section */}
          <div className="flex flex-col flex-1 gap-4 sm:gap-6 lg:gap-[30px] w-full">
            <h3 className="text-sm font-medium">Unique Referral Link</h3>
            <div className="flex gap-3 sm:gap-4 lg:gap-5 w-full">
              <input
                placeholder="Generating referral link"
                type="text"
                value={referralLink}
                readOnly
                className="border border-[#FFFFFF33] bg-transparent py-2.5 px-3 sm:px-4 lg:px-5 rounded-[10px] w-full font-medium text-xs text-[#FFFFFF99] h-12 sm:h-[54px]"
              />
              <button
                onClick={handleCopy}
                disabled={!referralLink}
                className="bg-[#FFFFFF] py-2.5 px-2.5 sm:px-5 rounded-[10px] h-12 sm:h-[54px] w-12 sm:w-[54px] flex items-center justify-center shrink-0 disabled:opacity-60"
                title={referralLink ? "Copy link" : "Connect wallet to get link"}
              >
                <CopyIcon />
              </button>
            </div>

            <button
              onClick={handleWebShare}
              disabled={!referralLink}
              className="bg-[#FFFFFF] py-2.5 px-5 rounded-[10px] w-full h-12 sm:h-[54px] text-[#040C33] text-sm font-medium flex items-center justify-center gap-2 lg:gap-[10px] disabled:opacity-60"
              title={referralLink ? "Share link" : "Connect wallet to share"}
            >
              <ShareIcon />
              <span>{copied ? "Copied!" : "Share"}</span>
            </button>
          </div>

          {/* Or Divider */}
          <div className="flex items-center justify-center w-full lg:w-auto">
            <div className="flex-1 lg:hidden h-px bg-[#FFFFFF33]"></div>
            <p className="mx-4 lg:mx-0 text-[#FFFFFF] font-bold text-[20px]">Or</p>
            <div className="flex-1 lg:hidden h-px bg-[#FFFFFF33]"></div>
          </div>

          {/* QR Code Section */}
          <div className="flex-1 flex flex-col items-center gap-3 sm:gap-4 lg:gap-[20px] w-full">
            <h3 className="text-base font-medium">QR Code</h3>

            <div className="w-32 sm:w-40 lg:w-auto">
              <img src={QrCode} alt="Referral QR" className="w-full" />
            </div>

            <p className="text-sm text-[#FFFFFFB2] font-medium text-center">Scan or Share referral code</p>

            <div className="flex items-center gap-3 sm:gap-4 lg:gap-[20px] w-full">
              <button className="bg-[#FFFFFF] py-2.5 px-3 sm:px-5 rounded-[10px] flex-1 h-12 sm:h-[54px] text-[#040C33] text-xs sm:text-sm font-medium flex items-center justify-center">
                Download QR Code
              </button>

              <button className="border-[#FFFFFF80] border py-2.5 px-2.5 sm:px-5 rounded-[10px] h-12 sm:h-[54px] w-12 sm:w-[54px] flex items-center justify-center shrink-0">
                <WhiteShare />
              </button>
            </div>
          </div>
        </div>

        {/* How it works Section */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">How it works</h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start sm:items-center space-x-3">
              <span className="text-lg sm:text-xl shrink-0">🧩</span>
              <span className="text-sm sm:text-base text-[#FFFFFF99]">
                +5 Points → When your referral completes all 5 learning modules
              </span>
            </div>
            <div className="flex items-start sm:items-center space-x-3">
              <span className="text-lg sm:text-xl shrink-0">🧑‍🏫</span>
              <span className="text-sm sm:text-base text-[#FFFFFF99]">+1 Point → When your referral attends any workshop</span>
            </div>
            <div className="flex items-start sm:items-center space-x-3">
              <span className="text-lg sm:text-xl shrink-0">🏅</span>
              <span className="text-sm sm:text-base text-[#FFFFFF99]">
                Bonus rewards → When you reach referral milestones (coming soon!)
              </span>
            </div>
          </div>
        </div>

        {/* Referral Status Section */}
        <div className="w-full max-w-full sm:max-w-2xl lg:max-w-[423px]">
          <h3 className="text-lg sm:text-xl font-bold mb-4">Referral Status</h3>
          {ReferralData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {ReferralData.map((data, index) => (
                <div
                  key={index}
                  className="bg-[#1F5793B2] border border-[#1F5793B2] p-4 sm:p-5 rounded-[20px] flex flex-col items-start gap-0.5"
                >
                  <h4 className="text-sm font-medium text-[#FFFFFF99]">{data.title}</h4>
                  <p className="text-[#FFFFFFE5] font-medium text-xl sm:text-2xl">{data.value}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#1F5793B2] border border-[#1F5793B2] p-4 sm:p-5">
              <p className="text-center text-[#FFFFFFE5] font-medium">No referrals yet. Start sharing your link!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
