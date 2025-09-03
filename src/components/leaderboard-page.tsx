/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import LeaderboardTable from "./Leaderboards";

const LeaderboardPage: React.FC = () => {
  return (
    // wherever you render the table
<div className="flex-1 p-4 sm:p-6">
  <section className="max-w-7xl mx-auto">
    <div className="mt-6 sm:mt-8 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6">
      <LeaderboardTable />
    </div>
  </section>
</div>

  );
};

export default LeaderboardPage;
