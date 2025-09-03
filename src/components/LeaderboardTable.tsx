// src/components/LeaderboardTable.tsx
import React from "react";
import { useLeaderboard, useSessionData } from "../session-data";

function shortAddr(addr?: string | null) {
  return addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "";
}

function medal(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return null;
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

export default function LeaderboardTable({
  showModal = false,
  onRowClick,
}: LeaderboardTableProps) {
  const { loading, error } = useSessionData();
  const leaderboard = useLeaderboard();

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

  if (loading) return <div className="text-white/80">Loading leaderboard…</div>;
  if (error) return <div className="text-red-400">Error: {error}</div>;

  const handleRowClick = (row: any, idx: number) => {
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
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="bg-white/10">
              <th className="text-left py-3 px-4 text-white/80 font-medium text-sm rounded-l-[10px] w-16">
                #
              </th>
              <th className="text-left py-3 px-4 text-white/80 font-medium text-sm min-w-[150px] sm:min-w-[200px]">
                User
              </th>
              <th className="text-left py-3 px-4 text-white/80 font-medium text-sm w-20">
                Score
              </th>
              <th className="text-left py-3 px-4 text-white/80 font-medium text-sm rounded-r-[10px] min-w-[120px]">
                Address
              </th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((row, idx) => {
              const rank = idx + 1;
              const name = row.username || shortAddr(row.address);
              const avatarSm =
                row.avatar ||
                dicebear(row.username || row.address || `user-${idx}`, 40);
              const key = `${row.username ?? ""}-${row.address ?? idx}`;

              return (
                <tr
                  key={key}
                  className={`border-b border-white/5 ${
                    showModal
                      ? "hover:bg-white/5 transition-colors cursor-pointer"
                      : ""
                  }`}
                  role={showModal ? "button" : undefined}
                  aria-label={
                    showModal ? `Open profile for ${name}` : undefined
                  }
                  tabIndex={showModal ? 0 : undefined}
                  onClick={
                    showModal ? () => handleRowClick(row, idx) : undefined
                  }
                  onKeyDown={
                    showModal
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleRowClick(row, idx);
                          }
                        }
                      : undefined
                  }
                >
                  <td className="py-3 px-4 text-white/90 font-semibold w-16">
                    <span className="inline-block w-6 text-center">
                      {medal(rank) ?? rank}
                    </span>
                  </td>
                  <td className="py-3 px-4 min-w-[150px] sm:min-w-[200px]">
                    <div className="flex items-center gap-3">
                      <img
                        src={avatarSm}
                        alt={name}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        onError={(e) => {
                          const el = e.currentTarget as HTMLImageElement;
                          if (el.src.includes("/svg"))
                            el.src = el.src.replace("/svg", "/png");
                        }}
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-white/90 font-medium truncate">
                          {name}
                        </span>
                        {row.username && row.address && (
                          <span className="text-white/50 text-xs truncate">
                            {shortAddr(row.address)}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-white/90 font-semibold w-20">
                    {row.score}
                  </td>
                  <td className="py-3 px-4 text-white/70 text-sm min-w-[120px]">
                    {shortAddr(row.address)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!leaderboard.length && (
          <div className="text-white/60 text-sm mt-4">No data available.</div>
        )}
      </div>

      {/* Profile Modal */}
      {showModal && selected && mounted && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={selected.avatar}
                alt={selected.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-white text-lg font-semibold">
                  {selected.name}
                </h3>
                {selected.address && (
                  <p className="text-white/60 text-sm">
                    {shortAddr(selected.address)}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/60">Score:</span>
                <span className="text-white font-semibold">
                  {selected.score}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
