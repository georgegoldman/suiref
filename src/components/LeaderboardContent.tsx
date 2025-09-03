import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import FirstBg from "../assets/1st-bg.png";
import SecondBg from "../assets/second-bg.png";
import ThirdBg from "../assets/third-bg.png";
import Avatar from "../assets/avatar.jpg";
import GoldMedalIcon from "../assets/gold-medal-icon";
import type { Profile } from "../types/profile";

interface LeaderboardContentProps {
  showBackButton?: boolean;
  padding?: string;
  centerContent?: boolean;
}

const LeaderboardContent = ({
  showBackButton = true,
  padding = "px-16 py-10",
  centerContent = true,
}: LeaderboardContentProps) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleProfileClick = (profile: Profile) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProfile(null);
  };

  const leaderboardData = [
    {
      id: 1,
      rank: 1,
      backgroundImage: FirstBg,
      name: "Emmanuel Rugger",
      invites: 12,
      referralCounts: 22,
      avatar: Avatar,
    },
    {
      id: 2,
      rank: 2,
      backgroundImage: SecondBg,
      name: "Emmanuel Rugger",
      invites: 12,
      referralCounts: 22,
      avatar: Avatar,
    },
    {
      id: 3,
      rank: 3,
      backgroundImage: ThirdBg,
      name: "Emmanuel Rugger",
      invites: 12,
      referralCounts: 22,
      avatar: Avatar,
    },
  ];

  // Activity data for the modal

  const tableData = [
    {
      id: 1,
      name: "Alex Okoro",
      avatars: [Avatar, Avatar],
      won: <GoldMedalIcon />,
      state: "Anambra State",
      referralCount: 200,
      workshopAttended: 5,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      avatars: [Avatar, Avatar, Avatar],
      won: <GoldMedalIcon />,
      state: "Lagos State",
      referralCount: 180,
      workshopAttended: 4,
    },
    {
      id: 3,
      name: "Michael Chen",
      avatars: [Avatar, Avatar],
      won: <GoldMedalIcon />,
      state: "Kano State",
      referralCount: 150,
      workshopAttended: 3,
    },
    {
      id: 4,
      name: "Emma Wilson",
      avatars: [Avatar],
      won: <GoldMedalIcon />,
      state: "Rivers State",
      referralCount: 120,
      workshopAttended: 2,
    },
    {
      id: 5,
      name: "David Brown",
      avatars: [Avatar, Avatar, Avatar, Avatar],
      won: <GoldMedalIcon />,
      state: "Kaduna State",
      referralCount: 100,
      workshopAttended: 1,
    },
  ];

  return (
    <div
      className={`flex flex-col gap-[3rem] ${padding} max-w-7xl ${
        centerContent ? "mx-auto" : ""
      }`}
    >
      <div className="flex flex-col gap-[20px]">
        {showBackButton && (
          <button
            className="flex items-center gap-[8px]"
            onClick={handleBackClick}
          >
            <div className="bg-[#4DA2FD] w-[45px] flex items-center justify-center h-[45px] rounded-[10px]">
              <AiOutlineArrowLeft />
            </div>
            <p>Back</p>
          </button>
        )}
        <div className="flex flex-col gap-[10px]">
          <h4 className="text-[24px] font-bold">Leaderboard</h4>
          <p className="text-white/69 text-xs font-medium">
            Ranks of visited workshop and earnings
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-[80px]">
        <div className="flex gap-[20px]">
          {leaderboardData.map((player) => (
            <div
              key={player.id}
              className="rounded-[15px] w-[234px] bg-[#040C33] relative overflow-hidden pb-2.5"
            >
              <div
                className="h-[58px] relative"
                style={{
                  backgroundImage: `url(${player.backgroundImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <span className="absolute bottom-2 right-4 text-black text-2xl font-inter italic font-light">
                  {player.rank}
                </span>
              </div>

              <div className="absolute top-[30px] left-[35px] transform -translate-x-1/2 w-[51px] h-[51px] rounded-[10px] border-2 border-white overflow-hidden">
                <img
                  src={player.avatar}
                  alt={`${player.rank} Profile`}
                  className="w-full h-full object-cover rounded-[10px]"
                />
              </div>

              <div className="pt-[40px] flex flex-col gap-[10px]">
                <h3 className="font-medium">{player.name}</h3>

                {/* Statistics */}
                <div className="flex items-center gap-[10px]">
                  <div className="flex flex-col gap-[4px]">
                    <p className="text-sm font-medium">{player.invites}</p>
                    <p className="text-white/50 font-medium text-[10px]">
                      Invites
                    </p>
                  </div>

                  <div className="flex flex-col gap-[4px]">
                    <p className="text-sm font-medium">
                      {player.referralCounts}
                    </p>
                    <p className="text-white/50 font-medium text-[10px]">
                      Referral Counts
                    </p>
                  </div>
                </div>

                <button
                  className="w-full bg-[#2A2A4A] text-white py-2.5 text-xs rounded-[10px] font-medium hover:bg-[#3A3A5A] transition-colors"
                  onClick={() => handleProfileClick(player)}
                >
                  Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-white/10">
              <th className="text-left flex items-center gap-2.5 py-3 px-4 text-white/80 font-medium text-sm rounded-l-[10px]">
                <span>#</span>
                <span>Name</span>
              </th>
              <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">
                Won
              </th>
              <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">
                State
              </th>
              <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">
                Referral count
              </th>
              <th className="text-left py-3 px-4 text-white/80 font-medium text-sm rounded-r-[10px]">
                Workshop attended
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr key={row.id} className="">
                <td className="py-3 px-4 text-white/90 font-medium">
                  <div className="flex items-center gap-2.5">
                    <span className="text-white/80 text-sm font-medium">
                      {row.id}.
                    </span>
                    <div className="flex -space-x-2">
                      {row.avatars.map((avatar, avatarIndex) => (
                        <div
                          key={avatarIndex}
                          className="w-[25px] h-[25px] rounded-full border border-white/80 overflow-hidden relative z-10"
                          style={{ zIndex: row.avatars.length - avatarIndex }}
                        >
                          <img
                            src={avatar}
                            alt={`${row.name} avatar ${avatarIndex + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <span className="text-white/80 text-sm font-medium">
                      {row.name}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-white/80 text-sm font-medium text-center">
                  {row.won}
                </td>
                <td className="py-3 px-4 text-white/80 text-sm font-medium">
                  {row.state}
                </td>
                <td className="py-3 px-4 text-white/80 text-sm font-medium text-center">
                  {row.referralCount}
                </td>
                <td className="py-3 px-4 text-white/80 text-sm font-medium text-center">
                  {row.workshopAttended}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Profile Modal */}
      {isModalOpen && selectedProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#040C33] rounded-[20px] w-[754px] max-h-[80vh] overflow-y-auto relative">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold flex-1 flex justify-center">
                Profile
              </h2>
              <button
                onClick={closeModal}
                className="text-white hover:text-gray-300 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Profile Banner */}
            <div
              className="h-[120px] relative"
              style={{
                backgroundImage: `url(${selectedProfile.backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Profile Picture */}
              <div className="absolute -bottom-8 left-8 w-[80px] h-[80px] rounded-[20px] border-2 border-white overflow-hidden">
                <img
                  src={selectedProfile.avatar}
                  alt={selectedProfile.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col gap-[30px] px-6 pb-6">
              {/* Profile Details */}
              <div className="pt-12 flex items-center justify-between">
                <div className="flex flex-col gap-2.5 flex-1">
                  <h3 className="text-xl font-medium">
                    {selectedProfile.name}
                  </h3>
                  <div className="flex flex-col gap-2.5">
                    <p className="text-white/50 text-[10px] font-medium">
                      Workshop Attended
                    </p>
                    <p className="text-white/80 text-sm font-medium">20</p>
                  </div>
                </div>

                {/* Statistics Grid */}
                <div className="flex flex-col gap-5 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2.5">
                      <p className="text-white/50 text-[10px] font-medium flex items-center gap-1">
                        Won{" "}
                        <span>
                          <GoldMedalIcon />
                        </span>
                      </p>
                      <p className="text-white/80 text-sm font-medium">5</p>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <p className="text-white/50 text-[10px] font-medium flex items-center gap-1">
                        State
                      </p>
                      <p className="text-white/80 text-sm font-medium">
                        Anambra State
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2.5">
                      <p className="text-white text-sm font-medium flex items-center gap-1">
                        12
                      </p>
                      <p className="text-white/50 text-[10px] font-medium">
                        Invites
                      </p>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <p className="text-white text-sm font-medium flex items-center gap-1">
                        22
                      </p>
                      <p className="text-white/50 text-[10px] font-medium">
                        Referral Counts
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Section */}
              {/* <div className="flex flex-col gap-5">
                <h4 className="text-white font-medium">Activity</h4>
                <table className="w-full">
                  {/* <thead>
                    <tr className="bg-white/10">
                      <th className="text-left p-[20px] text-white/80 font-medium text-sm rounded-l-[10px]">
                        Rank
                      </th>
                      <th className="text-left p-[20px] text-white/80 font-medium text-sm">
                        Won
                      </th>
                      <th className="text-left p-[20px] text-white/80 font-medium text-sm">
                        Event
                      </th>
                      <th className="text-left p-[20px] text-white/80 font-medium text-sm rounded-r-[10px]">
                        Date
                      </th>
                    </tr>
                  </thead> */}
                  {/* <tbody>
                    {activityData.map((activity) => (
                      <tr key={activity.id} className="">
                        <td className="py-3 px-4 text-white/80 text-sm font-medium">
                          {activity.rank}
                        </td>
                        <td className="py-3 px-4 text-white/80 text-sm font-medium">
                          {activity.won}
                        </td>
                        <td className="py-3 px-4 text-white/80 text-sm font-medium">
                          {activity.event}
                        </td>
                        <td className="py-3 px-4 text-white/80 text-sm font-medium">
                          {activity.date}
                        </td>
                      </tr>
                    ))}
                  </tbody> }
                </table>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardContent;
