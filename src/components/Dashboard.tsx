// src/components/Dashboard.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useSessionData, useUser } from "../session-data";
import { useCreateProfile } from "../mutations/useCreateProfile";
import { AvatarPicker } from "./AvatarPicker";
import DashboardReferralIcon from "../assets/dashboard-referral-icon";
import DashboardPointEarned from "../assets/dashboard-point-earned";

function getMoveFields(obj: any) {
  const content = obj?.data?.content;
  if (!content || content.dataType !== "moveObject") return undefined;
  return content.fields;
}

const Dashboard: React.FC = () => {
  const { loading, error, refresh, referralObject } = useSessionData();
  const { username, ranking, hasProfile } = useUser();
  const currentAccount = useCurrentAccount();
  const createProfile = useCreateProfile();

  // ---------- Build "My Recent Referrals" from ReferralPool ----------
  // Referral struct in Move: { referrer: string, referree: string }
  const referralList: any[] = React.useMemo(() => {
    const fields = getMoveFields(referralObject);
    const list = fields?.referal_list; // NOTE: contract uses 'referal_list'
    return Array.isArray(list) ? list : [];
  }, [referralObject]);

  const myRecentReferrals = React.useMemo(() => {
    if (!username) return [];
    // vector.push_back appends; assume list order is chronological → newest at end
    const mine = referralList
      .filter((it: any) => it?.fields?.referrer === username)
      .map((it: any) => ({
        referrer: String(it.fields.referrer),
        referree: String(it.fields.referree),
      }))
      .reverse(); // show newest first
    // limit to last 10 for UI
    return mine.slice(0, 10);
  }, [referralList, username]);

  // ---------- Create Profile form ----------
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
      await refresh(); // pull fresh profile + pools
      setUsernameInput("");
      setAvatarUrl("");
    } catch (err: any) {
      setSubmitError(err?.message ?? "Failed to create profile");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-white">Loading…</div>;
  if (error)   return <div className="text-red-400">Error: {error}</div>;

  return (
    <div className="flex-1 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-[31px]">
        {/* Header */}
        <div className="flex flex-col gap-2.5">
          <h1 className="text-white text-[24px] font-bold">
            Welcome{username ? `, ${username}` : ""} to SuiHub dashboard
          </h1>

          {!hasProfile && (
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
                  disabled={!currentAccount?.address || submitting}
                />
              </label>

              <div className="space-y-2">
                <div className="text-white/80 text-sm">Choose an avatar</div>
                <AvatarPicker value={avatarUrl} onChange={setAvatarUrl} format="svg" size={96} />
              </div>

              {submitError && <div className="text-red-400 text-sm">{submitError}</div>}

              <button
                type="submit"
                disabled={!currentAccount?.address || submitting}
                className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
              >
                {submitting ? "Creating…" : "Create Profile"}
              </button>
            </form>
          )}

          {/* {hasProfile && (
            <div className="mt-4 text-white/90 flex items-center gap-4">
              <img
                src={avatar ?? ""}
                alt="avatar"
                className="w-20 h-20 rounded-xl"
                onError={(e) => {
                  const el = e.currentTarget as HTMLImageElement;
                  if (el.src.includes("/svg")) el.src = el.src.replace("/svg", "/png");
                }}
              />
              <div>
                <div><b>Username:</b> {username || "—"}</div>
                <div><b>Ranking:</b> {ranking}</div>
              </div>
            </div>
          )} */}

          <p className="text-white/60 font-medium text-xs">
            Start by sharing your SUIREF username, and your rewards grow.
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

          <div className="bg-[#4DA2FD17] p-[20px] rounded-[10px] flex flex-col gap-[6px]">
            <div className="flex items-center gap-[6px]">
              <DashboardPointEarned />
              <h3 className="text-white/60 text-sm font-bold">Points Earned:</h3>
            </div>
            <p className="text-white text-2xl font-bold">0</p>
          </div>
        </div>

        {/* Recent Referrals — from ReferralPool (your entries as referrer) */}
        <div className="flex flex-col gap-[20px]">
          <h4 className="font-bold text-[20px]">Recent Referrals</h4>

          {!hasProfile && (
            <div className="text-white/60 text-sm">
              Create a profile to start referring users and see them here.
            </div>
          )}

          {hasProfile && (
            <div className="w-full overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/10 rounded-[10px]">
                    <th className="text-left py-3 px-4 text-white/50 font-bold rounded-l-[10px]">
                      Description
                    </th>
                    {/* No timestamp stored in Referral struct; show placeholder */}
                    <th className="text-left py-3 px-4 text-white/50 font-bold">Date</th>
                    <th className="text-left py-3 px-4 text-white/50 font-bold rounded-r-[10px]">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {myRecentReferrals.map((r, idx) => (
                    <tr key={`${r.referrer}-${r.referree}-${idx}`}>
                      <td className="py-3 px-4 text-white/90 font-bold">
                        You referred <span className="text-white/80">@{r.referree}</span>
                      </td>
                      <td className="py-3 px-4 text-white/70 font-medium">
                        —{/* No per-referral timestamp available */}
                      </td>
                      <td className="py-3 px-4 text-white/90 font-bold">+1</td>
                    </tr>
                  ))}

                  {!myRecentReferrals.length && (
                    <tr>
                      <td className="py-4 px-4 text-white/60 text-sm" colSpan={3}>
                        No referrals yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="text-white/40 text-xs mt-2">
                Tip: To show dates, emit an event in your Move function or store a timestamp per referral.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
