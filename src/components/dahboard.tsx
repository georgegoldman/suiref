import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import ReferralTools from "./ReferralTools";
import MyReferrals from "./MyReferrals";
import Workshop from "./Workshop";
import Rewards from "./Rewards";
import Leaderboards from "./Leaderboards";
import Wallets from "./Wallets";
import Settings from "./Settings";
import Support from "./Support";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDisconnectWallet } from "@mysten/dapp-kit";

export default function DashboardMain() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutateAsync: disconnectAsync } = useDisconnectWallet();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Get the current page from URL query parameter or default to referral-tools
  const getCurrentPage = () => {
    const params = new URLSearchParams(location.search);
    return params.get("tab") || "dashboard";
  };

  const [activePage, setActivePage] = useState(getCurrentPage());

  // Update active page when URL changes
  useEffect(() => {
    setActivePage(getCurrentPage());
  }, [location.search]);

  // Redirect to standalone leaderboard route if leaderboards tab is selected via URL
  useEffect(() => {
    if (activePage === "leaderboards") {
      navigate("/leaderboard");
    }
  }, [activePage, navigate]);

  const handleLogout = async () => {
    try {
      await disconnectAsync();
    } finally {
      sessionStorage.removeItem("sui_jwt_token");
      navigate("/login", { replace: true });
    }
  };

  const handlePageChange = (page: string) => {
    if (page === "leaderboards") {
      navigate("/leaderboard");
      return;
    }
    setActivePage(page);
    navigate(`/dashboard?tab=${page}`, { replace: true });
  };

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "referral-tools":
        return <ReferralTools />;
      case "my-referrals":
        return <MyReferrals />;
      case "workshop":
        return <Workshop onPageChange={handlePageChange} />;
      case "rewards":
        return <Rewards />;
      case "leaderboards":
        return <Leaderboards />;
      case "wallets":
        return <Wallets />;
      case "settings":
        return <Settings />;
      case "support":
        return <Support />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#040c33] text-white">
      {/* Sidebar: desktop persistent, mobile overlay handled via props */}
      <Sidebar
        activePage={activePage}
        onPageChange={(page) => {
          handlePageChange(page);
          setIsMobileSidebarOpen(false);
        }}
        onLogout={handleLogout}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        <Navbar onOpenSidebar={() => setIsMobileSidebarOpen(true)} />

        {renderContent()}
      </div>
    </div>
  );
}
