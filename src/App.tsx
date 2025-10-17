import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Onboard from "./components/onboard";
import Dashboard from "./components/dahboard";
import EnokiAuthCallback from "./routes/EnokiAuthCallback";

import { useEffect, type ReactNode } from "react";
import React from "react";
import LeaderboardPage from "./components/leaderboard-page";
import WalletConnect from "./components/wallet-connect";

type RouteProps = { children: ReactNode };

function ProtectedRoute({ children }: RouteProps) {
  const [ready, setReady] = React.useState(false);
  useEffect(() => {
    const id = setTimeout(() => setReady(true), 0);
    return () => clearTimeout(id);
  }, []);
  if (!ready)
    return (
      <div className="min-h-screen grid place-items-center text-white">
        Loading…
      </div>
    );

  return children;
}

function PublicRoute({ children }: RouteProps) {
  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboard />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <WalletConnect />
            </PublicRoute>
          }
        />
        <Route path="/auth" element={<EnokiAuthCallback />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
