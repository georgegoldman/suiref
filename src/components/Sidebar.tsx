import { useState } from "react";
import { HiX } from "react-icons/hi";
import SidebarCollapseIcon from "../assets/sidebar-collapse-icon";
import SidebarDashboardIcon from "../assets/sidebar-dashboard-icon";
// import SidebarReferralToolIcon from "../assets/sidebar-referral-tool-icon";
// import SidebarMyReferralIcon from "../assets/sidebar-my-referral-icon";
// import SidebarWorkshopIcon from "../assets/sidebar-workshop";
import SidebarRewardsIcon from "../assets/sidebar-rewards-icon";
import SidebarLeaderboardsIcon from "../assets/sidebar-leaderboards-icon";
import SidebarWalletIcon from "../assets/sidebar-wallet-icon";
// import SidebarSettingsIcon from "../assets/sidebar-settings-icon";
import SidebarSupportIcon from "../assets/sidebar-support-icon";
import SidebarLogoutIcon from "../assets/sidebar-logout-icon";
import { CopyButton } from "./CopyButton";
import { useUser } from "../session-data";
import Logo from "../assets/suiref-logo.png";
import SidebarReferralToolIcon from "../assets/sidebar-referral-tool-icon";

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
  onLogout: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

const Sidebar = ({
  activePage,
  onPageChange,
  onLogout,
  isMobileOpen,
  onMobileClose,
}: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { username, address } = useUser();

  const displayName =
    username ??
    (address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "User");

  const mainMenuItems = [
    // { id: "dashboard", label: "Dashboard", icon: SidebarDashboardIcon },
    // {
    //   id: "referral-tools",
    //   label: "Referral Tools",
    //   icon: SidebarReferralToolIcon,
    // },
    // { id: "my-referrals", label: "My Referrals", icon: SidebarMyReferralIcon },
    // { id: "workshop", label: "Workshop", icon: SidebarWorkshopIcon },
    // { id: "rewards", label: "Rewards", icon: SidebarRewardsIcon },
    // {
    //   id: "leaderboards",
    //   label: "Leaderboards",
    //   icon: SidebarLeaderboardsIcon,
    // },
    // { id: "wallets", label: "Wallets", icon: SidebarWalletIcon },
    { id: "ecosystem", label: "Ecosystem", icon: SidebarReferralToolIcon },
  ];

  const otherMenuItems = [
    // { id: "settings", label: "Settings", icon: SidebarSettingsIcon },
    { id: "support", label: "Support", icon: SidebarSupportIcon },
  ];

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handlePageChange = (page: string) => {
    onPageChange(page);
    // Close mobile sidebar when a page is selected
    if (window.innerWidth < 1024) {
      onMobileClose();
    }
  };

  const sidebarContent = (
    <div
      className={`flex flex-col gap-[2rem] border-r border-white/10 bg-[#040c33] transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } min-h-screen p-4`}
    >
      {/* Top Section - Logo and Collapse Icon */}
      <div className="flex items-center justify-between mb-6">
        {!isCollapsed && (
          <div className="text-white font-bold text-xl">
            <img src={Logo} alt="SuiRef" className="w-10 h-10" />
          </div>
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
                onClick={() => handlePageChange(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-[30px] transition-all duration-200 ${
                  isActive
                    ? "bg-[#1DA1F2] text-white"
                    : "text-white/70 hover:bg-white/5"
                }`}
              >
                <IconComponent />
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
                onClick={() => handlePageChange(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-[30px] transition-all duration-200 ${
                  isActive
                    ? "bg-[#1DA1F2] text-white"
                    : "text-white/70 hover:bg-white/5"
                }`}
              >
                <IconComponent />
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="flex items-center gap-2 px-3 py-2 text-white hover:bg-white/5 transition-colors"
      >
        <SidebarLogoutIcon />
        {!isCollapsed && <span className="text-xs">Logout</span>}
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">{sidebarContent}</div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onMobileClose}
          />

          {/* Sidebar */}
          <div className="fixed left-0 top-0 h-full w-64 bg-[#040c33] border-r border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col">
            {/* Mobile Header with Close Button */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
              <div className="text-white font-bold text-xl">
                <img src={Logo} alt="SuiRef" className="w-10 h-10" />
              </div>
              <button
                onClick={onMobileClose}
                className="text-white/70 hover:text-white transition-colors p-2"
              >
                <HiX size={24} />
              </button>
            </div>

            {/* Mobile Sidebar Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
              <div className="flex flex-col gap-[2rem]">
                {/* Main Menu Section */}
                <div className="flex flex-col gap-5 border-b border-white/5 pb-4">
                  <h3 className="text-white/70 text-[10px] uppercase tracking-wider">
                    Main Menu
                  </h3>

                  <nav className="flex flex-col gap-2">
                    {mainMenuItems.map((item) => {
                      const IconComponent = item.icon;
                      const isActive = activePage === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => handlePageChange(item.id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-[30px] transition-all duration-200 ${
                            isActive
                              ? "bg-[#1DA1F2] text-white"
                              : "text-white/70 hover:bg-white/5"
                          }`}
                        >
                          <IconComponent />
                          <span className="text-sm">{item.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Other Section */}
                <div className="flex flex-col gap-2 border-b border-white/5 pb-4">
                  <h3 className="text-white/70 text-[10px] uppercase tracking-wider">
                    Other
                  </h3>

                  <nav className="flex flex-col gap-2">
                    {otherMenuItems.map((item) => {
                      const IconComponent = item.icon;
                      const isActive = activePage === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => handlePageChange(item.id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-[30px] transition-all duration-200 ${
                            isActive
                              ? "bg-[#1DA1F2] text-white"
                              : "text-white/70 hover:bg-white/5"
                          }`}
                        >
                          <IconComponent />
                          <span className="text-sm">{item.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* User Info Section - Before Logout */}
                <div className="flex flex-col gap-2 border-b border-white/5 pb-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-white text-sm font-medium">
                      {displayName}
                    </span>
                    <CopyButton value={address} />
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-3 py-2 text-white hover:bg-white/5 transition-colors"
                >
                  <SidebarLogoutIcon />
                  <span className="text-xs">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
