import { useState } from "react";
import SidebarCollapseIcon from "../assets/sidebar-collapse-icon";
import SidebarDashboardIcon from "../assets/sidebar-dashboard-icon";
import SidebarReferralToolIcon from "../assets/sidebar-referral-tool-icon";
import SidebarMyReferralIcon from "../assets/sidebar-my-referral-icon";
import SidebarWorkshopIcon from "../assets/sidebar-workshop";
import SidebarRewardsIcon from "../assets/sidebar-rewards-icon";
import SidebarLeaderboardsIcon from "../assets/sidebar-leaderboards-icon";
import SidebarWalletIcon from "../assets/sidebar-wallet-icon";
import SidebarSettingsIcon from "../assets/sidebar-settings-icon";
import SidebarSupportIcon from "../assets/sidebar-support-icon";
import SidebarLogoutIcon from "../assets/sidebar-logout-icon";

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
  onLogout: () => void;
}

const Sidebar = ({ activePage, onPageChange, onLogout }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const mainMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: SidebarDashboardIcon },
    {
      id: "referral-tools",
      label: "Referral Tools",
      icon: SidebarReferralToolIcon,
    },
    { id: "my-referrals", label: "My Referrals", icon: SidebarMyReferralIcon },
    { id: "workshop", label: "Workshop", icon: SidebarWorkshopIcon },
    { id: "rewards", label: "Rewards", icon: SidebarRewardsIcon },
    {
      id: "leaderboards",
      label: "Leaderboards",
      icon: SidebarLeaderboardsIcon,
    },
    { id: "wallets", label: "Wallets", icon: SidebarWalletIcon },
  ];

  const otherMenuItems = [
    { id: "settings", label: "Settings", icon: SidebarSettingsIcon },
    { id: "support", label: "Support", icon: SidebarSupportIcon },
  ];

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`flex flex-col gap-[2rem] border-r border-white/10 bg-[#040c33] transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } min-h-screen p-4`}
    >
      {/* Top Section - Logo and Collapse Icon */}
      <div className="flex items-center justify-between mb-6">
        {!isCollapsed && (
          <div className="text-white font-bold text-xl">SuiHub</div>
        )}
        <button
          onClick={toggleCollapse}
          className="text-white/70 hover:text-white transition-colors"
        >
          <SidebarCollapseIcon />
        </button>
      </div>

      {/* Main Menu Section */}
      <div className="flex flex-col gap-5 border-b border-white/5 pb-4">
        <h3 className="text-white/70 text-[10px] uppercase tracking-wider">
          {!isCollapsed && "Main Menu"}
        </h3>

        <nav className="flex flex-col gap-2">
          {mainMenuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`flex items-center ${
                  isCollapsed ? "justify-center rounded-[8px]" : "gap-2 rounded-[30px]"
                } px-3 py-2 transition-all duration-200 ${
                  isActive
                    ? "bg-[#1DA1F2] text-white"
                    : "text-white/70 hover:bg-white/5"
                }`}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <IconComponent />
                </div>
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Other Section */}
      <div className="flex flex-col gap-2 border-b border-white/5 pb-4">
        <h3 className="text-white/70 text-[10px] uppercase tracking-wider">
          {!isCollapsed && "Other"}
        </h3>

        <nav className="flex flex-col gap-2">
          {otherMenuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`flex items-center ${
                  isCollapsed ? "justify-center rounded-[8px]" : "gap-2 rounded-[30px]"
                } px-3 py-2 transition-all duration-200 ${
                  isActive
                    ? "bg-[#1DA1F2] text-white"
                    : "text-white/70 hover:bg-white/5"
                }`}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <IconComponent />
                </div>
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className={`flex items-center ${
          isCollapsed ? "justify-center" : "gap-2"
        } px-3 py-2 text-white hover:bg-white/5 transition-colors`}
      >
        <div className="w-4 h-4 flex items-center justify-center">
          <SidebarLogoutIcon />
        </div>
        {!isCollapsed && <span className="text-xs">Logout</span>}
      </button>
    </div>
  );
};

export default Sidebar;
