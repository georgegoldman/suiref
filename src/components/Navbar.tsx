// import { useCurrentAccount } from "@mysten/dapp-kit";
import { AiOutlineMenu } from "react-icons/ai";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashboardSearchIcon from "../assets/dashboard-search-icon";
import DashboardNotificationIcon from "../assets/dashboard-notification-icon";
import DashboardDropdownIcon from "../assets/dashboard-dropdown-icon";

interface NavbarProps {
  onOpenSidebar?: () => void;
}

const Navbar = ({ onOpenSidebar }: NavbarProps) => {
  // const account = useCurrentAccount();

  const userName = "Michael";

  const location = useLocation();
  useEffect(() => {
    // close any native keyboards or overlays upon route changes if needed
  }, [location.pathname]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between lg:items-center py-4 sm:py-5 px-4 sm:px-8 bg-[#040c33] border-b border-white/10">
      <div className="flex items-center justify-between w-full sm:w-auto">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
        <div className="flex lg:items-center item-start">
          <span className="text-white/70 text-xs font-medium">
            Welcome back,
          </span>
          <span className="">👋</span>
        </div>
        <span className="text-white text-[20px] sm:text-[24px] font-bold">{userName}!</span>
        </div>
        <button
          className="inline-flex lg:hidden items-center justify-center w-10 h-10 rounded-md bg-white/10 hover:bg-white/20 text-white ml-3"
          onClick={onOpenSidebar}
          aria-label="Open menu"
        >
          <AiOutlineMenu size={20} />
        </button>
      </div>

      <div className="w-full sm:flex-1 sm:max-w-md sm:mx-8 hidden sm:block">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-white/10 py-2.5 px-5 h-[48px] sm:h-[52px] pl-12 rounded-[40px] text-white text-xs placeholder-white/70"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <DashboardSearchIcon />
          </div>
        </div>
      </div>

      {/* Third Section - Notifications and Profile */}
      <div className="hidden sm:flex items-center gap-2.5">
        {/* Notification Icon */}
        <div className="bg-white/10 rounded-full w-[44px] h-[44px] sm:w-[50px] sm:h-[50px] flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
          <DashboardNotificationIcon />
        </div>

        {/* Profile Section */}
        <div className="bg-white/10 rounded-full px-2 py-1 flex items-center gap-2 cursor-pointer hover:bg-white/20 transition-colors">
          {/* Profile Picture */}
          <div className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-full bg-gradient-to-r from-[#1DA1F2] to-[#1DA1F2]/80 flex items-center justify-center">
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
