// src/components/LeaderboardTable.tsx
import React from "react";
import { HiX } from "react-icons/hi";
import { Copy } from "lucide-react";
import {
  useLeaderboard,
  useSessionData,
  type LeaderEntry,
} from "../session-data";

function shortAddr(addr?: string | null) {
  return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";
}

function dicebear(seed: string, size = 80) {
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
    seed || "user"
  )}&size=${size}&radius=50`;
}

type Selected = {
  name: string;
  avatar: string;
  address?: string | null;
  score: number;
};

interface LeaderboardTableProps {
  showModal?: boolean;
  onRowClick?: (selected: Selected) => void;
}

const RankBadge = ({ rank }: { rank: number }) => {
  const badgeBase =
    "inline-flex items-center justify-center w-10 h-8 rounded-lg font-bold border";
  
  if (rank === 1) {
    return (
      <span className={`${badgeBase} bg-[#FFD700]/10 text-[#B8860B] border-[#FFD700]/50`}>
        1st
      </span>
    );
  }
  if (rank === 2) {
    return (
      <span className={`${badgeBase} bg-[#C0C0C0]/10 text-[#707070] border-[#C0C0C0]/50`}>
        2nd
      </span>
    );
  }
  if (rank === 3) {
    return (
      <span className={`${badgeBase} bg-[#CD7F32]/10 text-[#A0522D] border-[#CD7F32]/50`}>
        3rd
      </span>
    );
  }
  return <span className="inline-flex items-center justify-center w-10 h-8 text-black/50 font-medium">{rank}</span>;
};

export default function LeaderboardTable({
  showModal = false,
  onRowClick,
}: LeaderboardTableProps) {
  const { loading, error } = useSessionData();
  const leaderboard = useLeaderboard();

  // Sort leaderboard by score descending
  const sortedLeaderboard = React.useMemo(() => {
    return [...leaderboard].sort((a, b) => b.score - a.score);
  }, [leaderboard]);

  const [selected, setSelected] = React.useState<Selected | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  // close on ESC
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (loading) return <div className="text-black/80">Loading leaderboard…</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  const handleRowClick = (row: LeaderEntry, idx: number) => {
    if (!showModal) return;

    const name = row.username || shortAddr(row.address);
    const avatarLg =
      row.avatar || dicebear(row.username || row.address || `user-${idx}`, 96);

    const selectedData = {
      name,
      avatar: avatarLg,
      address: row.address,
      score: row.score,
    };

    if (onRowClick) {
      onRowClick(selectedData);
    } else {
      setSelected(selectedData);
    }
  };

  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[600px] border-separate border-spacing-y-2">
          <thead>
            <tr className="text-sm text-black/60">
              <th className="font-medium text-left py-2 pl-4 w-16"></th>
              <th className="font-medium text-left py-2">User</th>
              <th className="font-medium text-center py-2">Score</th>
              <th className="font-medium text-right py-2 pr-8">Address</th>
            </tr>
          </thead>
          <tbody>
            {sortedLeaderboard.map((row, idx) => {
              const rank = idx + 1;
              const name = row.username || shortAddr(row.address) || "Unknown";
              const key = `${row.username ?? ""}-${row.address ?? idx}`;
              const avatarSm =
                row.avatar ||
                dicebear(row.username || row.address || `user-${idx}`, 40);

              return (
                <tr
                  key={key}
                  className={`group transition-colors ${
                    showModal ? "cursor-pointer hover:bg-black/5" : ""
                  }`}
                  onClick={
                    showModal ? () => handleRowClick(row, idx) : undefined
                  }
                >
                  <td className="py-3 pl-4 align-middle">
                    <RankBadge rank={rank} />
                  </td>
                  <td className="py-3 align-middle">
                    <div className="flex items-center gap-3">
                      <img
                        src={avatarSm}
                        alt={name}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        loading="lazy"
                      />
                      <span className="text-black/80 font-medium truncate max-w-[150px] sm:max-w-[200px]">
                        {name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-center align-middle font-bold text-black">
                    {row.score}
                  </td>
                  <td className="py-3 pr-8 text-right align-middle font-medium text-black/60 text-sm">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(row.address || "");
                      }}
                      className="hover:text-black transition-colors flex items-center justify-end gap-2 ml-auto"
                      title="Copy Address"
                    >
                      {shortAddr(row.address)}
                      <Copy size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!leaderboard.length && (
          <div className="text-black/60 text-sm mt-4 text-center">No standing data available.</div>
        )}
      </div>

      {/* Profile Modal */}
      {showModal && selected && mounted && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full relative shadow-xl border border-black/5">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-black/50 hover:text-black transition-colors"
              aria-label="Close"
            >
              <HiX size={20} />
            </button>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={selected.avatar}
                alt={selected.name}
                className="w-16 h-16 rounded-full object-cover border border-black/10"
              />
              <div>
                <h3 className="text-black text-lg font-semibold">
                  {selected.name}
                </h3>
                {selected.address && (
                  <p className="text-black/60 text-sm">
                    {shortAddr(selected.address)}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-black/60">Score:</span>
                <span className="text-black font-semibold">
                  {selected.score}
                </span>
              </div>
            </div>
            <button className="mt-6 w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-black/90 transition-colors">
              View on Chain
            </button>
          </div>
        </div>
      )}
    </>
  );
}
