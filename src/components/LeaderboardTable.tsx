// src/components/LeaderboardTable.tsx
import React from "react";
import { createPortal } from "react-dom";
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
  score: number; // invites
};

export default function LeaderboardTable() {
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

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-white/10">
            <th className="text-left py-3 px-4 text-white/80 font-medium text-sm rounded-l-[10px]">#</th>
            <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">User</th>
            <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Score</th>
            <th className="text-left py-3 px-4 text-white/80 font-medium text-sm rounded-r-[10px] hidden sm:table-cell">
              Address
            </th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((row, idx) => {
            const rank = idx + 1;
            const name = row.username || shortAddr(row.address);
            const avatarSm =
              row.avatar || dicebear(row.username || row.address || `user-${idx}`, 40);
            const avatarLg =
              row.avatar || dicebear(row.username || row.address || `user-${idx}`, 96);
            const key = `${row.username ?? ""}-${row.address ?? idx}`;

            const openModal = () => {
              console.log("Row clicked → open modal:", name);
              setSelected({
                name,
                avatar: avatarLg,
                address: row.address,
                score: row.score,
              });
            };

            return (
              <tr
                key={key}
                className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                role="button"
                aria-label={`Open profile for ${name}`}
                tabIndex={0}
                onClick={openModal}
                onClickCapture={openModal} // extra safety: capture phase
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openModal();
                  }
                }}
                style={{ pointerEvents: "auto" }} // guard in case a parent disabled them
              >
                <td className="py-3 px-4 text-white/90 font-semibold">
                  <span className="inline-block w-6 text-center">
                    {medal(rank) ?? rank}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={avatarSm}
                      alt={name}
                      className="w-8 h-8 rounded-full object-cover pointer-events-none"
                      onError={(e) => {
                        const el = e.currentTarget as HTMLImageElement;
                        if (el.src.includes("/svg")) el.src = el.src.replace("/svg", "/png");
                      }}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="flex flex-col">
                      <span className="text-white/90 font-medium">{name}</span>
                      {row.username && row.address && (
                        <span className="text-white/50 text-xs">{shortAddr(row.address)}</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-white/90 font-semibold">{row.score}</td>
                <td className="py-3 px-4 text-white/70 text-sm hidden sm:table-cell">
                  {shortAddr(row.address)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {!leaderboard.length && (
        <div className="text-white/60 text-sm mt-4">No referrals yet.</div>
      )}

      {/* Modal via portal (always on top) */}
      {mounted && selected &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="bg-[#040C33] rounded-2xl w-[720px] max-w-[95vw] border border-white/10 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <h2 className="text-xl font-bold">Profile</h2>
                <button
                  onClick={() => setSelected(null)}
                  className="text-white/80 hover:text-white"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                <div className="flex items-center gap-4">
                  <img
                    src={selected.avatar}
                    alt={selected.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-white"
                    onError={(e) => {
                      const el = e.currentTarget as HTMLImageElement;
                      if (el.src.includes("/svg")) el.src = el.src.replace("/svg", "/png");
                    }}
                  />
                  <div className="min-w-0">
                    <div className="text-lg font-semibold truncate">{selected.name}</div>
                    {selected.address && (
                      <div className="text-white/60 text-sm">{shortAddr(selected.address)}</div>
                    )}
                  </div>
                </div>

                {/* Quick stats row */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-white/50 text-[10px] font-medium">Workshop Attended</p>
                    <p className="text-white/80 text-sm">—</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-[10px] font-medium">Won</p>
                    <p className="text-white/80 text-sm">🥇 —</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-[10px] font-medium">State</p>
                    <p className="text-white/80 text-sm">—</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-[10px] font-medium">Invites</p>
                    <p className="text-white/80 text-sm">{selected.score}</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelected(null)}
                    className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
