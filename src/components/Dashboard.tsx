import DashboardReferralIcon from "../assets/dashboard-referral-icon";
import DashboardWorkshopAttendeesIcon from "../assets/dashboard-workshop-attendees-icon";
import DashboardModuleCompleterIcon from "../assets/dashboard-module-completer-icon";
import DashboardPointEarned from "../assets/dashboard-point-earned";
import DashboardCancelIcon from "../assets/dashboard-cancel-icon";
import CuteCoin from "../assets/mingcute_coin-3-fill.svg";
import ReferralComponent from "./referral-component";

const Dashboard = () => {
  // Table data array
  const tableData = [
    {
      description: "DevJohn Attended Workshop",
      date: "10/6/2025",
      points: "+1",
    },
    {
      description: "Alice Completed Modules",
      date: "10/5/2025",
      points: "+5",
    },
    {
      description: "Bob Joined Platform",
      date: "10/4/2025",
      points: "+1",
    },
    {
      description: "Sarah Attended Workshop",
      date: "10/3/2025",
      points: "+1",
    },
    {
      description: "Mike Completed Modules",
      date: "10/2/2025",
      points: "+5",
    },
  ];

  return (
    <div className="flex-1 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-[31px]">
        {/* Header */}
        <div className="flex flex-col gap-2.5">
          <h1 className="text-white text-[24px] font-bold">
            Welcome to SuiHub dashboard
          </h1>
          <p className="text-white/60 font-medium text-xs">
            Start by sharing your referral link, and your rewards grows
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[30px]">
          <div className="bg-[#4DA2FD17] p-[20px] rounded-[10px] flex flex-col gap-[6px]">
            <div className="flex items-center gap-[6px]">
              <DashboardReferralIcon />
              <h3 className="text-white/60 text-sm font-bold">
                Total Referral:
              </h3>
            </div>
            <p className="text-white text-2xl font-bold">0</p>
          </div>

          <div className="bg-[#4DA2FD17] p-[20px] rounded-[10px] flex flex-col gap-[6px]">
            <div className="flex items-center gap-[6px]">
              <DashboardWorkshopAttendeesIcon />
              <h3 className="text-white/60 text-sm font-bold">
                Workshop Attendees:
              </h3>
            </div>
            <p className="text-white text-2xl font-bold">100</p>
          </div>

          <div className="bg-[#4DA2FD17] p-[20px] rounded-[10px] flex flex-col gap-[6px]">
            <div className="flex items-center gap-[6px]">
              <DashboardModuleCompleterIcon />
              <h3 className="text-white/60 text-sm font-bold">
                Full Module Completers:
              </h3>
            </div>
            <p className="text-white text-2xl font-bold">0</p>
          </div>

          <div className="bg-[#4DA2FD17] p-[20px] rounded-[10px] flex flex-col gap-[6px]">
            <div className="flex items-center gap-[6px]">
              <DashboardPointEarned />
              <h3 className="text-white/60 text-sm font-bold">
                Points Earned:
              </h3>
            </div>
            <p className="text-white text-2xl font-bold">0</p>
          </div>
        </div>

        <div className="bg-white p-[30px] max-w-[826px] w-full flex items-start justify-between rounded-[20px] relative">
          <div className="flex flex-1 items-center gap-[20px]">
            <div className="w-[3px] h-[45px] bg-[#FCC11A]"></div>
            <div className="flex flex-col gap-[8px]">
              <h5 className="font-bold text-base text-[#040C33]">
                Points Card
              </h5>
              <p className="text-sm text-[#040C33]/70 font-medium">
                You’ve earned +1 points when you attend a workshop and +5 points
                when they complete all modules.
              </p>
            </div>
          </div>
          <button>
            <DashboardCancelIcon />
          </button>

          <div className="absolute bottom-0 right-0">
            <img src={CuteCoin} alt="Cute Coin" />
          </div>
        </div>

        <div className="flex flex-col gap-[20px]">
          <h4 className="font-bold text-[20px]">Referral Link/QR Code</h4>
          <ReferralComponent />
        </div>

        <div className="flex flex-col gap-[20px]">
          <h4 className="font-bold text-[20px]">Recent Referrals</h4>
          <table className="w-full">
            <thead>
              <tr className="bg-white/10 rounded-[10px]">
                <th className="text-left py-3 px-4 text-white/50 font-bold rounded-l-[10px]">
                  Description
                </th>
                <th className="text-left py-3 px-4 text-white/50 font-bold">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-white/50 font-bold rounded-r-[10px]">
                  Points
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td className="py-3 px-4 text-white/90 font-bold">
                    {row.description}
                  </td>
                  <td className="py-3 px-4 text-white/90 font-bold">
                    {row.date}
                  </td>
                  <td className="py-3 px-4 text-white/90 font-bold">
                    {row.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
