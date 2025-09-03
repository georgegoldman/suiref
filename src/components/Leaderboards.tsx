// src/components/Leaderboards.tsx
import React from "react";
import { useSessionData } from "../session-data";
import LeaderboardTable from "./LeaderboardTable";

export default function Leaderboards() {
  const { loading, error } = useSessionData();

  if (loading) return <div className="text-white/80">Loading leaderboard…</div>;
  if (error) return <div className="text-red-400">Error: {error}</div>;

  return (
    <div className="w-full p-4">
      <LeaderboardTable showModal={true} />
    </div>
  );
}
