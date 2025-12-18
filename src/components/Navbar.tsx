import { useState, useRef, useEffect } from "react";
import { HiMenu } from "react-icons/hi";
import DashboardSearchIcon from "../assets/dashboard-search-icon";
import { useUser } from "../session-data";
// import { useProfileModal } from "../ui/ProfileModalProvider"; // Removed
import { ProfilePill } from "./ProfilePill";

interface NavbarProps {
  onMobileMenuOpen: () => void;
  onLogout: () => void;
  onPageChange: (page: string) => void;
}

function shortAddr(addr?: string | null) {
  return addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "";
}

const Navbar = ({ onMobileMenuOpen, onLogout, onPageChange }: NavbarProps) => {
  const { username, avatar, address, hasProfile } = useUser();
  // const { open } = useProfileModal(); // Removed local modal
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayName = username ?? shortAddr(address);
  const initial = (username ?? address ?? "?").slice(0, 1).toUpperCase();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onToggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <div className="flex justify-between items-center py-5 px-4 sm:px-6 lg:px-8 bg-white border-b border-black/10">
      {/* Left side - Mobile Menu Button and User Info */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button - Only visible on mobile */}
        <button
          onClick={onMobileMenuOpen}
          className="lg:hidden text-black/70 hover:text-black transition-colors p-2"
        >
          <HiMenu size={24} />
        </button>

        {/* Desktop User Info - Hidden on mobile */}
        <div className="hidden lg:flex flex-col">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2">
            <button
              onClick={() =>
                navigator.clipboard
                  .writeText(address || "")
                  .then(() => alert("Text copied to clipboard!"))
                  .catch((err) => {
                    alert("Failed to copy text. Please try again.");
                    console.log(err);
                  })
              }
            >
              <span className="text-black text-[18px] lg:text-[24px] font-bold">
                Hi {displayName} 👋
              </span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <span className="text-black/70 text-xs font-medium">Welcome</span>
          </div>
        </div>
      </div>

      {/* Center - Search Bar - Hidden on mobile */}
      <div className="hidden lg:flex flex-1 max-w-md w-full mx-8">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-black/5 py-2.5 px-5 h-[52px] pl-12 rounded-[40px] text-black text-xs placeholder-black/70"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <DashboardSearchIcon />
          </div>
        </div>
      </div>

      {/* Right side - Profile Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <ProfilePill
          hasProfile={hasProfile}
          avatar={avatar}
          initial={initial}
          onOpenProfile={onToggleProfile}
          isMenuOpen={isProfileOpen}
        />

        {/* Dropdown Menu */}
        {isProfileOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-black/10 py-2 z-50">
            {/* User Name Header */}
            <div className="px-4 py-2 border-b border-black/5">
              <p className="text-sm font-bold text-black truncate">
                {displayName}
              </p>
            </div>

            {/* Profile Link */}
            <button
              onClick={() => {
                setIsProfileOpen(false);
                onPageChange("profile");
              }}
              className="w-full text-left px-4 py-2 text-sm text-black/70 hover:bg-black/5 hover:text-black transition-colors font-medium"
            >
              Profile
            </button>

            {/* Settings Link */}
            <button
              onClick={() => {
                setIsProfileOpen(false);
                onPageChange("settings");
              }}
              className="w-full text-left px-4 py-2 text-sm text-black/70 hover:bg-black/5 hover:text-black transition-colors font-medium"
            >
              Settings
            </button>

            {/* Sign Out Button */}
            <button
              onClick={() => {
                setIsProfileOpen(false);
                onLogout();
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-black/5 transition-colors font-medium"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
