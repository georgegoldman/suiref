import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// import Onboard from "./components/onboard"; // Commented out - root now shows Ecosystem
import Dashboard from "./components/dahboard";
import EnokiAuthCallback from "./routes/EnokiAuthCallback";
import { useEffect, type ReactNode } from "react";
import React from "react";
import LeaderboardPage from "./components/leaderboard-page";
// import WalletConnect from "./components/wallet-connect"; // Commented out - not needed for root
import { SessionDataProvider } from "./session-data";
import { ProfileModalProvider } from "./ui/ProfileModalProvider";
import Ecosystem from "./components/Ecosystem";
import LandingPage from "./components/LandingPage";

// ===== Admin pages (make stubs if they don't exist yet) =====
import AdminDashboard from "./admin/AdminDashboard";
// import AdminLeaderboard from "./admin/AdminLeaderboard";

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

// Commented out - not currently used since root shows Ecosystem directly
// function PublicRoute({ children }: RouteProps) {
//   return children;
// }

export default function App() {
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  const isAdminHost = host === "console.localhost";

  return (
    <SessionDataProvider>
      <ProfileModalProvider>
        <Router>
          {isAdminHost ? (
            // ================= ADMIN ROUTES =================
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              {/* <Route path="/leaderboard" element={<AdminLeaderboard />} /> */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          ) : (
            // ================= USER ROUTES =================
            <Routes>
              {/* Root URL now shows LandingPage */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/ecosystem" element={<Ecosystem />} />
              {/* <Route path="/" element={<Onboard />} /> */}
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              {/* Login route commented out - not needed for root access */}
              {/* <Route
                path="/login"
                element={
                  <PublicRoute>
                    <WalletConnect />
                  </PublicRoute>
                }
              /> */}
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
          )}
        </Router>
      </ProfileModalProvider>
    </SessionDataProvider>
  );
}
