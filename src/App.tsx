// App.tsx
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Onboard from "./components/onboard";
import Login from "./components/login";
import Dashboard from "./components/dahboard";
import EnokiAuthCallback from "./routes/EnokiAuthCallback";

import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
  useSuiClientContext,
  useCurrentAccount,
} from "@mysten/dapp-kit";
import { isEnokiNetwork, registerEnokiWallets } from "@mysten/enoki";
import { getFullnodeUrl } from "@mysten/sui/client";
import { useEffect, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import LeaderboardPage from "./components/leaderboard-page";
// import ReferralPage from "./components/referral-page";
import { SessionDataProvider } from "./session-data";
import { ProfileModalProvider } from "./ui/ProfileModalProvider";

const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl("testnet") },
});
const queryClient = new QueryClient();

type RouteProps = { children: ReactNode };

function ProtectedRoute({ children }: RouteProps) {
  const currentAccount = useCurrentAccount();

  // Show a tiny loading state on first paint so autoConnect can finish
  // This prevents a brief mis-detection and redirect flicker.
  const [ready, setReady] = React.useState(false);
  useEffect(() => { const id = setTimeout(() => setReady(true), 0); return () => clearTimeout(id); }, []);
  if (!ready) return <div className="min-h-screen grid place-items-center text-white">Loading…</div>;

  return currentAccount ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: RouteProps) {
  const currentAccount = useCurrentAccount();
  return !currentAccount ? children : <Navigate to="/dashboard" replace />;
}

function RegisterEnokiWallets() {
  const { client, network } = useSuiClientContext();

  useEffect(() => {
    const apiKey = import.meta.env.VITE_ENOKI_API_KEY;
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!isEnokiNetwork(network) || !apiKey || !googleClientId) return;

    const { unregister } = registerEnokiWallets({
      apiKey,
      providers: { google: { clientId: googleClientId } },
      client,
      network,
    });
    return unregister;
  }, [network, client]);

  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <RegisterEnokiWallets />
        <WalletProvider autoConnect={true}>
          <SessionDataProvider>
            <ProfileModalProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<Onboard />} />
                  <Route path="/leaderboard" element={<LeaderboardPage />} />
                  {/* <Route path="/referral" element={<ReferralPage />} /> */}
                  <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                  <Route path="/auth" element={<EnokiAuthCallback />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Router>
            </ProfileModalProvider>
          </SessionDataProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
