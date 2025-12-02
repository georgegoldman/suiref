// src/components/Dashboard.tsx
import React from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useSessionData, useUser } from "../session-data";
import { useCreateProfile } from "../mutations/useCreateProfile";
import { AvatarPicker } from "./AvatarPicker";
import DashboardReferralIcon from "../assets/dashboard-referral-icon";
import DashboardPointEarned from "../assets/dashboard-point-earned";
import { EventDetailModal } from "../admin/EventDetailModal";

function getMoveFields(obj: any) {
  const content = obj?.data?.content;
  if (!content || content.dataType !== "moveObject") return undefined;
  return content.fields;
}

const EventFilterDropdown: React.FC<{
  value: string;
  onChange: (v: string) => void;
}> = ({ value, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const items = ["All Events", "Upcoming", "Past"];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="
          h-10 px-4 rounded-full
          bg-white/5 hover:bg-white/10 ring-1 ring-white/10
          text-white/90 text-sm inline-flex items-center gap-2
          focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40
        "
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{value}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6 9l6 6 6-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="
            absolute right-0 mt-2 w-44 overflow-hidden
            rounded-xl bg-[#0A133A] ring-1 ring-white/10 shadow-xl z-10
          "
        >
          {items.map((it) => (
            <li key={it}>
              <button
                type="button"
                onClick={() => {
                  onChange(it);
                  setOpen(false);
                }}
                className="
                  w-full text-left px-4 py-2 text-sm
                  text-white/90 hover:bg-white/10
                "
                role="option"
                aria-selected={it === value}
              >
                {it}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const CreateReferralButton: React.FC<{
  username?: string | null;
  address?: string | null;
}> = ({ username, address }) => {
  const [copied, setCopied] = React.useState(false);
  const id = username || address || "";
  const url = id ? `${window.location.origin}/r/${id}` : "";

  const handleClick = async () => {
    if (!id) {
      alert("Create a profile or connect your wallet to get a referral link.");
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt("Copy your referral link:", url);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="
        h-10 px-5 rounded-full
        bg-[#4DA2FD] hover:bg-[#63AEFF]
        text-[#031335] font-semibold text-sm
        inline-flex items-center gap-2
        shadow-[0_6px_20px_rgba(77,162,253,0.35)]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40
      "
      title={url || "Referral link"}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 5v14M5 12h14"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </svg>
      {copied ? "Copied!" : "Create referral link"}
    </button>
  );
};

const Dashboard: React.FC = () => {
  const { loading, error, refresh, referralObject } = useSessionData();
  const { username, ranking, hasProfile } = useUser();
  const currentAccount = useCurrentAccount();
  const createProfile = useCreateProfile();
  const [eventFilter, setEventFilter] = React.useState("All Events");

  const referralList: any[] = React.useMemo(() => {
    const fields = getMoveFields(referralObject);
    const list = fields?.referal_list;
    return Array.isArray(list) ? list : [];
  }, [referralObject]);

  const myRecentReferrals = React.useMemo(() => {
    if (!username) return [];
    const mine = referralList
      .filter((it: any) => it?.fields?.referrer === username)
      .map((it: any) => ({
        referrer: String(it.fields.referrer),
        referree: String(it.fields.referree),
      }))
      .reverse();
    return mine.slice(0, 10);
  }, [referralList, username]);

  const [usernameInput, setUsernameInput] = React.useState("");
  const [avatarUrl, setAvatarUrl] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string>();
  const [selectedEventId, setSelectedEventId] = React.useState<string | null>(
    null
  );

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!avatarUrl) return setSubmitError("Please select an avatar.");
    setSubmitting(true);
    setSubmitError(undefined);
    try {
      await createProfile(usernameInput.trim(), avatarUrl.trim());
      await refresh();
      setUsernameInput("");
      setAvatarUrl("");
    } catch (err: any) {
      setSubmitError(err?.message ?? "Failed to create profile");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-white">Loading…</div>;
  if (error) return <div className="text-red-400">Error: {error}</div>;

  return (
    <div className="flex-1 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        {/* Header */}
        {/* Header + Top-right controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-white text-[24px] font-bold">
              Welcome to SuiHub dashboard
            </h1>
            <p className="text-white/60 text-sm">
              Start by sharing your referral link, and your rewards grows
            </p>
          </div>

          <div className="flex items-center gap-3">
            <EventFilterDropdown
              value={eventFilter}
              onChange={setEventFilter}
            />
            <CreateReferralButton
              username={username}
              address={currentAccount?.address ?? null}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-[#13214D] p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <DashboardReferralIcon />
              <span className="text-white/70 font-semibold text-sm">
                Total Referral:
              </span>
            </div>
            <p className="text-white text-3xl font-bold mt-2">{ranking ?? 0}</p>
          </div>

          <div className="bg-[#13214D] p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <DashboardReferralIcon />
              <span className="text-white/70 font-semibold text-sm">
                Workshop Attendees:
              </span>
            </div>
            <p className="text-white text-3xl font-bold mt-2">0</p>
          </div>

          <div className="bg-[#13214D] p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <DashboardPointEarned />
              <span className="text-white/70 font-semibold text-sm">
                Points Earned:
              </span>
            </div>
            <p className="text-white text-3xl font-bold mt-2">0</p>
          </div>
        </div>

        {/* Ongoing Events */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-bold text-lg">Ongoing Events</h4>
            <button className="text-white/70 text-sm hover:text-white">
              See All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                onClick={() => setSelectedEventId(`event-${i}`)}
                className="bg-[#0A133A] rounded-xl overflow-hidden border border-white/10 cursor-pointer hover:border-white/20 transition-colors"
              >
                <img
                  src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=60"
                  alt="event"
                  className="w-full h-[140px] object-cover"
                />
                <div className="p-4 space-y-2">
                  <p className="text-white/60 text-xs">
                    Saturday, Nov 2 • 8:00 AM
                  </p>
                  <h5 className="text-white font-bold text-base">
                    SuiRef Conference 2.0
                  </h5>
                  <p className="text-white/60 text-sm">
                    By <span className="text-white">SuiRef Conference</span>
                  </p>
                  <p className="text-white/60 text-sm flex items-center gap-1">
                    📍 Eronye Junction, Enugu State
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <img
                          key={idx}
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${idx}`}
                          className="w-6 h-6 rounded-full border border-[#0A133A]"
                        />
                      ))}
                    </div>
                    <span className="text-white/70 text-xs">+15</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Referrals */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold text-lg">Recent Referrals</h4>
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="text-white/60 text-xs font-medium text-left">
                  <th className="pb-2">Description</th>
                  <th className="pb-2">Date</th>
                  <th className="pb-2 text-right pr-4">Points</th>
                </tr>
              </thead>
              <tbody>
                {myRecentReferrals.length ? (
                  myRecentReferrals.map((r, idx) => (
                    <tr
                      key={idx}
                      className="bg-[#0A133A] hover:bg-[#12204F] rounded-lg"
                    >
                      <td className="py-3 px-4 text-white font-medium rounded-l-lg">
                        {r.referree} Attended Workshop
                      </td>
                      <td className="py-3 px-4 text-white/80 text-sm">
                        10/6/2025
                      </td>
                      <td className="py-3 px-4 text-white font-bold text-right pr-4 rounded-r-lg">
                        +1
                      </td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr className="bg-[#0A133A] rounded-lg">
                      <td
                        colSpan={3}
                        className="py-4 px-4 text-white/60 text-center"
                      >
                        No referrals yet.
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      <EventDetailModal
        eventId={selectedEventId || ""}
        isOpen={!!selectedEventId}
        onClose={() => setSelectedEventId(null)}
        event={
          selectedEventId
            ? {
                title: "SUIREF CONCERT NIGHT",
                date: "Wednesday October, 2022",
                time: "5:00 PM - 6:00 PM",
                location: "Awka",
                locationDetail: "Awka, Anambra",
                category: "SUIREF CONCERT NIGHT",
                status: "private",
                image:
                  "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=60",
                host: {
                  name: "John Deo",
                  avatar:
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
                },
                attendeeCount: 2,
                attendees: [
                  {
                    name: "John deo",
                    avatar:
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
                  },
                ],
              }
            : undefined
        }
      />
    </div>
  );
};

export default Dashboard;
