import LeaderboardTable from "./LeaderboardTable";

const DashboardLeaderboard = () => {
  return (
    <div className="flex-1 p-4 sm:p-6 md:w-full xs:w-[400px] xxs:w-[350px] xxxs:w-[300px]">
      <div className="bg-white/5 rounded-2xl p-4 sm:p-5 border border-white/10">
        <h2 className="text-white text-lg font-semibold mb-3">Leaderboard</h2>
        <LeaderboardTable showModal={true} />
      </div>
    </div>
  );
};

export default DashboardLeaderboard;
