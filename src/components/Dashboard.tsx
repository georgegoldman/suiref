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
      <div className="max-w-6xl mx-auto flex flex-col gap-[1.9375rem]">
        {/* Header */}
        <div className="flex flex-col gap-2.5">
          <h1 className="text-white text-[1.5rem] font-bold">
            Welcome to SuiHub dashboard
          </h1>
          <p className="text-white/60 font-medium text-xs">
            Start by sharing your referral link, and your rewards grows
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1.25rem] sm:gap-[1.5rem] lg:gap-[1.875rem]">
          <div className="bg-[#4DA2FD17] p-[1.25rem] rounded-[0.625rem] flex flex-col gap-[0.375rem]">
            <div className="flex items-center gap-[0.375rem]">
              <DashboardReferralIcon />
              <h3 className="text-white/60 text-sm font-bold">
                Total Referral:
              </h3>
            </div>
            <p className="text-white text-2xl font-bold">0</p>
          </div>

          <div className="bg-[#4DA2FD17] p-[1.25rem] rounded-[0.625rem] flex flex-col gap-[0.375rem]">
            <div className="flex items-center gap-[0.375rem]">
              <DashboardWorkshopAttendeesIcon />
              <h3 className="text-white/60 text-sm font-bold">
                Workshop Attendees:
              </h3>
            </div>
            <p className="text-white text-2xl font-bold">100</p>
          </div>

          <div className="bg-[#4DA2FD17] p-[1.25rem] rounded-[0.625rem] flex flex-col gap-[0.375rem]">
            <div className="flex items-center gap-[0.375rem]">
              <DashboardModuleCompleterIcon />
              <h3 className="text-white/60 text-sm font-bold">
                Full Module Completers:
              </h3>
            </div>
            <p className="text-white text-2xl font-bold">0</p>
          </div>

          <div className="bg-[#4DA2FD17] p-[1.25rem] rounded-[0.625rem] flex flex-col gap-[0.375rem]">
            <div className="flex items-center gap-[0.375rem]">
              <DashboardPointEarned />
              <h3 className="text-white/60 text-sm font-bold">
                Points Earned:
              </h3>
            </div>
            <p className="text-white text-2xl font-bold">0</p>
          </div>
        </div>

        <div className="bg-white p-[1.25rem] sm:p-[1.5rem] lg:p-[1.875rem] w-full flex flex-col sm:flex-row items-start sm:items-start justify-between rounded-[1.25rem] relative overflow-hidden">
          <div className="flex flex-1 items-start gap-[0.75rem] sm:gap-[1rem] lg:gap-[1.25rem]">
            <div className="w-[clamp(0.125rem,0.3vw,0.1875rem)] h-[clamp(2rem,6vh,2.8125rem)] bg-[#FCC11A]"></div>
            <div className="flex flex-col gap-[0.5rem]">
              <h5 className="font-bold text-base text-[#040C33]">
                Points Card
              </h5>
              <p className="text-sm text-[#040C33]/70 font-medium">
                You’ve earned +1 points when you attend a workshop and +5 points
                when they complete all modules.
              </p>
            </div>
          </div>
          <button className="mt-4 sm:mt-0">
            <DashboardCancelIcon />
          </button>

          <div className="absolute bottom-0 right-0 w-20 sm:w-28 lg:w-auto">
            <img src={CuteCoin} alt="Cute Coin" className="w-full h-auto" />
          </div>
        </div>

        <div className="flex flex-col gap-[1.25rem]">
          <h4 className="font-bold text-[1.25rem]">Referral Link/QR Code</h4>
          <ReferralComponent />
        </div>

        <div className="flex flex-col gap-[1.25rem]">
          <h4 className="font-bold text-[1.25rem]">Recent Referrals</h4>
          <div className="w-full overflow-x-auto rounded-[0.625rem] border border-white/10">
          <table className="w-full min-w-[clamp(20rem,90vw,37.5rem)]">
            <thead>
              <tr className="bg-white/10 rounded-[0.625rem]">
                <th className="text-left py-3 px-4 text-white/50 font-bold rounded-l-[0.625rem]">
                  Description
                </th>
                <th className="text-left py-3 px-4 text-white/50 font-bold">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-white/50 font-bold rounded-r-[0.625rem]">
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
    </div>
  );
};

export default Dashboard;
