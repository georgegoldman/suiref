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
      <div className="max-w-6xl mx-auto flex flex-col gap-[3.125rem]">
        <div className="flex flex-col gap-[0.625rem]">
          <h2 className="text-2xl font-bold">My Referrals</h2>
          <p className="text-white/60 text-xs font-medium">
            Start by sharing your referral link, and your rewards grows
          </p>
        </div>

        <div className="flex flex-col gap-[0.625rem]">
          <div className="flex flex-col gap-[0.375rem] bg-[#4DA2FD17] rounded-[0.625rem] p-[1.25rem] w-full max-w-[clamp(18rem,85vw,32.0625rem)]">
            <h5 className="text-white/60 text-sm font-bold">Total earnings:</h5>
            <p className="text-[1.5rem] font-bold">0</p>
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
          <div className="flex items-center gap-[0.9375rem]">
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

export default MyReferrals;
