import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Onboard from "./components/onboard";
import Login from "./components/login";
import Dashboard from "./components/dahboard";
import { useState, type ReactNode } from "react";
import WalletConnect from "./components/wallet-connect";

type ProtectedRouteProps = {
  children: ReactNode;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboard />} /> //Home Page Route
        <Route path="/login" element={<Login />} /> //Login Route
        <Route path="/wallet-connect" element={<WalletConnect isAuthenticated = {isAuthenticated} setIsAuthenticated = {setIsAuthenticated}/>} /> //Wallet
        Connect Route
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
