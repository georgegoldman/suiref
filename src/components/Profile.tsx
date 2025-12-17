import React from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useSessionData, useUser } from "../session-data";
import DashboardReferralIcon from "../assets/dashboard-referral-icon";
import DashboardPointEarned from "../assets/dashboard-point-earned";
import { MapPin } from "lucide-react";

// Mock NFT Data
const myNFTs = [
  {
    id: "nft-1",
    name: "SuiRef Genesis",
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=400&q=80",
    description: "Early adopter badge",
  },
  {
    id: "nft-2",
    name: "Workshop Master",
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=400&q=80",
    description: "Attended 5 workshops",
  },
];

function getMoveFields(obj: any) {
  const content = obj?.data?.content;
  if (!content || content.dataType !== "moveObject") return undefined;
  return content.fields;
}

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
        shadow-sm outline outline-1 outline-black/10
        focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40
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

// Mock Events Data
const mockEvents = Array.from({ length: 6 }).map((_, i) => ({
  id: i,
  title: i % 2 === 0 ? "SuiRef Conference 2.0" : "Sui Move Workshop",
  date: "Saturday, Nov 2 • 8:00 AM",
  organizer: "SuiRef Conference",
  location: "Eronye Junction, Enugu State",
  image: `https://images.unsplash.com/photo-${
    i % 2 === 0 ? "1529333166437-7750a6dd5a70" : "1505373876426-413fe993961f"
  }?auto=format&fit=crop&w=800&q=60`,
}));

const Profile: React.FC = () => {
  const { loading, error, referralObject } = useSessionData();
  const { username, ranking } = useUser();
  const currentAccount = useCurrentAccount();
  const [showAllEvents, setShowAllEvents] = React.useState(false);
  
  const referralList: any[] = React.useMemo(() => {
    const fields = getMoveFields(referralObject);
    const list = fields?.referal_list;
    return Array.isArray(list) ? list : [];
  }, [referralObject]);
//...

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

  if (loading) return <div className="text-black">Loading…</div>;
  if (error) return <div className="text-red-400">Error: {error}</div>;

  return (
    <div className="flex-1 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-black text-[24px] font-bold">
              My Profile
            </h1>
            <p className="text-black/60 text-sm">
              Manage your events, referrals, and rewards
            </p>
          </div>

          <div className="flex items-center gap-3">
            <CreateReferralButton
              username={username}
              address={currentAccount?.address ?? null}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-gray-50 border border-black/5 p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <DashboardReferralIcon />
              <span className="text-black/70 font-semibold text-sm">
                Total Referral:
              </span>
            </div>
            <p className="text-black text-3xl font-bold mt-2">{ranking ?? 0}</p>
          </div>

          <div className="bg-gray-50 border border-black/5 p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <DashboardReferralIcon />
              <span className="text-black/70 font-semibold text-sm">
                Workshop Attendees:
              </span>
            </div>
            <p className="text-black text-3xl font-bold mt-2">0</p>
          </div>

          <div className="bg-gray-50 border border-black/5 p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <DashboardPointEarned />
              <span className="text-black/70 font-semibold text-sm">
                Points Earned:
              </span>
            </div>
            <p className="text-black text-3xl font-bold mt-2">0</p>
          </div>
        </div>

        {/* User's NFT Gallery */}
         <div className="flex flex-col gap-4">
          <h4 className="text-black font-bold text-lg">My NFTs</h4>
          {myNFTs.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {myNFTs.map((nft) => (
                <div key={nft.id} className="bg-white border border-black/10 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-100">
                    <img src={nft.image} alt={nft.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-sm text-black">{nft.name}</p>
                    <p className="text-black/60 text-xs">{nft.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="py-8 text-center border-2 border-dashed border-gray-200 rounded-xl">
               <p className="text-gray-500">No NFTs found</p>
             </div>
          )}
        </div>

        {/* Ongoing Events (Restored Grid View) */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h4 className="text-black font-bold text-lg">Events Attended</h4>
            <button
              onClick={() => setShowAllEvents(!showAllEvents)}
              className="text-black/70 text-sm hover:text-black"
            >
              {showAllEvents ? "Show Less" : "See All"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockEvents
              .slice(0, showAllEvents ? undefined : 3)
              .map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-xl overflow-hidden border border-black/10 cursor-pointer hover:border-black/20 transition-colors"
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-[140px] object-cover"
                  />
                  <div className="p-4 space-y-2">
                    <p className="text-black/60 text-xs">{event.date}</p>
                    <h5 className="text-black font-bold text-base">
                      {event.title}
                    </h5>
                    <p className="text-black/60 text-sm">
                      By{" "}
                      <span className="text-black font-medium">
                        {event.organizer}
                      </span>
                    </p>
                    <p className="text-black/60 text-sm flex items-center gap-1">
                      <MapPin size={14} /> {event.location}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {/* Placeholder avatars */}
                        <div className="w-6 h-6 rounded-full bg-gray-200 border border-white"></div>
                        <div className="w-6 h-6 rounded-full bg-gray-300 border border-white"></div>
                        <div className="w-6 h-6 rounded-full bg-gray-300 border border-white"></div>
                      </div>
                      <span className="text-black/70 text-xs">+15</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Recent Referrals */}
        <div className="flex flex-col gap-4">
          <h4 className="text-black font-bold text-lg">Recent Referrals</h4>
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="text-black/60 text-xs font-medium text-left">
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
                      className="bg-white hover:bg-gray-50 rounded-lg border-b border-black/5"
                    >
                      <td className="py-3 px-4 text-black font-medium rounded-l-lg">
                        {r.referree} Attended Workshop
                      </td>
                      <td className="py-3 px-4 text-black/80 text-sm">
                        10/6/2025
                      </td>
                      <td className="py-3 px-4 text-black font-bold text-right pr-4 rounded-r-lg">
                        +1
                      </td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr className="bg-white rounded-lg">
                      <td
                        colSpan={3}
                        className="py-4 px-4 text-black/60 text-center"
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
    </div>
  );
};

export default Profile;
