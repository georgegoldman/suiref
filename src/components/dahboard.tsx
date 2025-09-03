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

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDisconnectWallet } from "@mysten/dapp-kit";

export default function DashboardMain() {
  const navigate = useNavigate();
  const { mutateAsync: disconnectAsync } = useDisconnectWallet();
  const [activePage, setActivePage] = useState("dashboard");

  const handleLogout = async () => {
    try {
      await disconnectAsync();
    } finally {
      sessionStorage.removeItem("sui_jwt_token");
      navigate("/login", { replace: true });
    }
  };

  const handlePageChange = (page: string) => {
    setActivePage(page);
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
        return <Workshop />;
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
      <Sidebar
        activePage={activePage}
        onPageChange={handlePageChange}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col">
        <Navbar />

        {renderContent()}
      </div>
    </div>
  );
}
