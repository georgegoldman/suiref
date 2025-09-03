/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useSessionData } from "../session-data";
import { useCreateProfile } from "../mutations/useCreateProfile";
import { AvatarPicker } from "./AvatarPicker";

import DashboardReferralIcon from "../assets/dashboard-referral-icon";
import DashboardPointEarned from "../assets/dashboard-point-earned";

const Dashboard: React.FC = () => {
  const { sharedObject, loading, error } = useSessionData();
  const currentAccount = useCurrentAccount();
  const createProfile = useCreateProfile();

  // --- Safely extract fields & pool list ---
  const poolList = React.useMemo<any[]>(() => {
    const content = (sharedObject as any)?.data?.content;
    if (!content || content.dataType !== "moveObject") return [];
    const list = content.fields?.pool_list;
    return Array.isArray(list) ? list : [];
  }, [sharedObject]);

  // --- My profile in the pool (if any) ---
  const myProfile = React.useMemo<any | null>(() => {
    const addr = currentAccount?.address?.toLowerCase();
    if (!addr) return null;
    return (
      poolList.find(
        (item: any) =>
          typeof item?.fields?.owner === "string" &&
          item.fields.owner.toLowerCase() === addr
      ) ?? null
    );
  }, [poolList, currentAccount?.address]);

  // --- Derived, safe values used throughout the UI ---
  const username = myProfile?.fields?.username ?? "";
  const ranking = Number(myProfile?.fields?.ranking ?? 0);
  const avatar = myProfile?.fields?.url ?? "";

  // --- Debug (optional) ---
  React.useEffect(() => {
    if (sharedObject) console.debug("Shared object updated:", sharedObject);
  }, [sharedObject]);

  // --- Create Profile form state ---
  const [usernameInput, setUsernameInput] = React.useState("");
  const [avatarUrl, setAvatarUrl] = React.useState(""); // DiceBear URL
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string>();

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!avatarUrl) {
      setSubmitError("Please select an avatar.");
      return;
    }
    setSubmitting(true);
    setSubmitError(undefined);
    try {
      await createProfile(usernameInput.trim(), avatarUrl.trim());
    } catch (err: any) {
      setSubmitError(err?.message ?? "Failed to create profile");
    } finally {
      setSubmitting(false);
    }
  };

  // --- Static table data (placeholder) ---
  const tableData = [
    { description: "DevJohn Attended Workshop", date: "10/6/2025", points: "+1" },
    { description: "Alice Completed Modules", date: "10/5/2025", points: "+5" },
    { description: "Bob Joined Platform", date: "10/4/2025", points: "+1" },
    { description: "Sarah Attended Workshop", date: "10/3/2025", points: "+1" },
    { description: "Mike Completed Modules", date: "10/2/2025", points: "+5" },
  ];

  if (loading) return <div className="text-white">Loading…</div>;
  if (error) return <div className="text-red-400">Error: {error}</div>;

  return (
    <div className="flex-1 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-[31px]">
        {/* Header */}
        <div className="flex flex-col gap-2.5">
          <h1 className="text-white text-[24px] font-bold">
            Welcome{username ? `, ${username}` : ""} to SuiHub dashboard
          </h1>

          {/* Create Profile form when user has no profile */}
          {!myProfile && (
            <form onSubmit={onCreate} className="mt-4 max-w-md space-y-3">
              <label className="block">
                <span className="text-white/80 text-sm">Username</span>
                <input
                  className="w-full rounded px-3 py-2 bg-white/10 text-white"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  required
                  minLength={3}
                  maxLength={24}
                />
              </label>

              <div className="space-y-2">
                <div className="text-white/80 text-sm">Choose an avatar</div>
                <AvatarPicker
                  value={avatarUrl}
                  onChange={setAvatarUrl}
                  format="svg"
                  size={96}
                />
                {/* {avatarUrl && (
                  <div className="text-white/70 text-xs break-all">
                    Selected URL: <span className="font-mono">{avatarUrl}</span>
                  </div>
                )} */}
              </div>

              {submitError && <div className="text-red-400 text-sm">{submitError}</div>}

              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
              >
                {submitting ? "Creating…" : "Create Profile"}
              </button>
            </form>
          )}

          {/* Profile summary when user has a profile */}
          {myProfile && (
            <div className="mt-4 text-white/90 flex items-center gap-4">
              <img
                src={avatar}
                alt="avatar"
                className="w-20 h-20 rounded-xl"
                onError={(e) => {
                  const el = e.currentTarget as HTMLImageElement;
                  if (el.src.includes("/svg")) el.src = el.src.replace("/svg", "/png");
                }}
              />
              <div>
                <div>
                  <b>Username:</b> {username || "—"}
                </div>
                <div>
                  <b>Ranking:</b> {ranking}
                </div>
              </div>
            </div>
          )}

          <p className="text-white/60 font-medium text-xs">
            Start by sharing your SUIREF username, and your rewards grows
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[30px]">
          <div className="bg-[#4DA2FD17] p-[20px] rounded-[10px] flex flex-col gap-[6px]">
            <div className="flex items-center gap-[6px]">
              <DashboardReferralIcon />
              <h3 className="text-white/60 text-sm font-bold">Total Referral:</h3>
            </div>
            <p className="text-white text-2xl font-bold">{ranking}</p>
          </div>

          {/* <div className="bg-[#4DA2FD17] p-[20px] rounded-[10px] flex flex-col gap-[6px]">
            <div className="flex items-center gap-[6px]">
              <DashboardWorkshopAttendeesIcon />
              <h3 className="text-white/60 text-sm font-bold">Workshop Attendees:</h3>
            </div>
            <p className="text-white text-2xl font-bold">100</p>
          </div> */}

          {/* <div className="bg-[#4DA2FD17] p-[20px] rounded-[10px] flex flex-col gap-[6px]">
            <div className="flex items-center gap-[6px]">
              <DashboardModuleCompleterIcon />
              <h3 className="text-white/60 text-sm font-bold">Full Module Completers:</h3>
            </div>
            <p className="text-white text-2xl font-bold">0</p>
          </div> */}

          <div className="bg-[#4DA2FD17] p-[20px] rounded-[10px] flex flex-col gap-[6px]">
            <div className="flex items-center gap-[6px]">
              <DashboardPointEarned />
              <h3 className="text-white/60 text-sm font-bold">Points Earned:</h3>
            </div>
            <p className="text-white text-2xl font-bold">0</p>
          </div>
        </div>

        {/* <div className="bg-white p-[30px] max-w-[826px] w-full flex items-start justify-between rounded-[20px] relative">
          <div className="flex flex-1 items-center gap-[20px]">
            <div className="w-[3px] h-[45px] bg-[#FCC11A]"></div>
            <div className="flex flex-col gap-[8px]">
              <h5 className="font-bold text-base text-[#040C33]">Points Card</h5>
              <p className="text-sm text-[#040C33]/70 font-medium">
                You’ve earned +1 points when you attend a workshop and +5 points when they complete all modules.
              </p>
            </div>
          </div>
          <button>
            <DashboardCancelIcon />
          </button>
          <div className="absolute bottom-0 right-0">
            <img src={CuteCoin} alt="Cute Coin" />
          </div>
        </div> */}

        {/* <div className="flex flex-col gap-[20px]">
          <h4 className="font-bold text-[20px]">Referral Link/QR Code</h4>
          <ReferralComponent />
        </div> */}

        <div className="flex flex-col gap-[20px]">
          <h4 className="font-bold text-[20px]">Recent Referrals</h4>
          <table className="w-full">
            <thead>
              <tr className="bg-white/10 rounded-[10px]">
                <th className="text-left py-3 px-4 text-white/50 font-bold rounded-l-[10px]">Description</th>
                <th className="text-left py-3 px-4 text-white/50 font-bold">Date</th>
                <th className="text-left py-3 px-4 text-white/50 font-bold rounded-r-[10px]">Points</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td className="py-3 px-4 text-white/90 font-bold">{row.description}</td>
                  <td className="py-3 px-4 text-white/90 font-bold">{row.date}</td>
                  <td className="py-3 px-4 text-white/90 font-bold">{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
