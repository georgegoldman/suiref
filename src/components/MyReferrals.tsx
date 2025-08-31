import WhatsappBlueIcon from "../assets/whatsapp-blue-icon";
import XBlueIcon from "../assets/x-blue-icon";
import ReferralComponent from "./referral-component";

const MyReferrals = () => {
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
      <div className="max-w-6xl mx-auto flex flex-col gap-[50px]">
        <div className="flex flex-col gap-[10px]">
          <h2 className="text-2xl font-bold">My Referrals</h2>
          <p className="text-white/60 text-xs font-medium">
            Start by sharing your referral link, and your rewards grows
          </p>
        </div>

        <div className="flex flex-col gap-[10px]">
          <div className="flex flex-col gap-[6px] bg-[#4DA2FD17] rounded-[10px] p-[20px] w-[513px]">
            <h5 className="text-white/60 text-sm font-bold">Total earnings:</h5>
            <p className="text-[24px] font-bold">0</p>
            <div className="flex flex-col">
              <div className="border-b border-white/20 flex items-center justify-between pb-2">
                <h5 className="text-white/60 text-sm font-bold">
                  Invites sent
                </h5>
                <p className="text-white/60 text-sm font-bold">0</p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <h5 className="text-white/60 text-sm font-bold">
                  Total Referrals
                </h5>
                <p className="text-white/60 text-sm font-bold">0</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-[15px]">
            <p className="text-white/70 text-sm font-bold">
              Select a platform to share your link instantly
            </p>
            <div className="flex items-center gap-2">
              <button>
                <XBlueIcon />
              </button>
              <button>
                <WhatsappBlueIcon />
              </button>
            </div>
          </div>
        </div>

        <ReferralComponent />

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

export default MyReferrals;
