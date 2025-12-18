import LeaderboardTable from "./LeaderboardTable";

const DashboardLeaderboard = () => {
  return (
    <div className="flex-1 p-4 sm:p-6 max-w-5xl w-full mx-auto">
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-black/10">
        <h2 className="text-black text-lg font-semibold mb-3">Leaderboard</h2>
        <LeaderboardTable showModal={true} />
      </div>
    </div>
  );
};

export default DashboardLeaderboard;
