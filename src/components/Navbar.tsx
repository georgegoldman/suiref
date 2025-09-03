// import { useCurrentAccount } from "@mysten/dapp-kit";
import DashboardSearchIcon from "../assets/dashboard-search-icon";
import DashboardNotificationIcon from "../assets/dashboard-notification-icon";
import DashboardDropdownIcon from "../assets/dashboard-dropdown-icon";
import { useCurrentAccount } from "@mysten/dapp-kit";

const Navbar = () => {
  // const account = useCurrentAccount();
  const currentAccount = useCurrentAccount();

  const userName = "Michael";

  return (
    <div className="flex justify-between items-center py-5 px-8 bg-[#040c33] border-b border-white/10">
      <div className="flex flex-col">
        <div className="flex items-center">
          <span className="text-white/70 text-xs font-medium">
            Welcome back,
          </span>
          <span className="">👋</span>
        </div>
        <span className="text-white text-[24px] font-bold">{currentAccount?.address}</span>
      </div>

      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-white/10 py-2.5 px-5 h-[52px] pl-12 rounded-[40px] text-white text-xs placeholder-white/70"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <DashboardSearchIcon />
          </div>
        </div>
      </div>

      {/* Third Section - Notifications and Profile */}
      <div className="flex items-center gap-2.5">
        {/* Notification Icon */}
        <div className="bg-white/10 rounded-full w-[50px] h-[50px] flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
          <DashboardNotificationIcon />
        </div>

        {/* Profile Section */}
        <div className="bg-white/10 rounded-full px-2 py-1 flex items-center gap-2 cursor-pointer hover:bg-white/20 transition-colors">
          {/* Profile Picture */}
          <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-r from-[#1DA1F2] to-[#1DA1F2]/80 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>

          <DashboardDropdownIcon />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
