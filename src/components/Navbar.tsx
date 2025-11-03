import { HiMenu } from "react-icons/hi";
import DashboardSearchIcon from "../assets/dashboard-search-icon";
import { useUser } from "../session-data";
import { useProfileModal } from "../ui/ProfileModalProvider";
import { ProfilePill } from "./ProfilePill";

interface NavbarProps {
  onMobileMenuOpen: () => void;
}

function shortAddr(addr?: string | null) {
  return addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "";
}

const Navbar = ({ onMobileMenuOpen }: NavbarProps) => {
  const { username, avatar, address, hasProfile, ranking } = useUser(); // add ranking to useUser in session-data if not present
  const { open } = useProfileModal();

  const displayName = username ?? shortAddr(address);
  const initial = (username ?? address ?? "?").slice(0, 1).toUpperCase();
  const banner =
    "https://images.unsplash.com/photo-1517816428104-797678c7cf0d?q=80&w=1200&auto=format&fit=crop"; // placeholder banner

  const onOpenProfile = () => {
    open({
      name: displayName,
      avatar:
        hasProfile && avatar
          ? avatar
          : `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
              initial
            )}&size=128&radius=50`,
      backgroundImage: banner,
      username: username ?? undefined,
      ranking: ranking ?? 0,
      activities: { rank: 1, won: true, event: "Sui Workshop", date: "8/20/2025" },
    });
  };

  return (
    <div className="flex justify-between items-center py-5 px-4 sm:px-6 lg:px-8 bg-[#040c33] border-b border-white/10">
      {/* Left side - Mobile Menu Button and User Info */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button - Only visible on mobile */}
        <button
          onClick={onMobileMenuOpen}
          className="lg:hidden text-white/70 hover:text-white transition-colors p-2"
        >
          <HiMenu size={24} />
        </button>

        {/* Desktop User Info - Hidden on mobile */}
        <div className="hidden lg:flex flex-col">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2">
            <button
            onClick={() => navigator.clipboard.writeText(address || "").then(()=> alert("Text copied to clipboard!")).catch(err => {
              alert("Failed to copy text. Please try again.")
            })}
            >
              <span 
            
            className="text-white text-[18px] lg:text-[24px] font-bold">
              Hi {displayName} 👋
            </span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <span className="text-white/70 text-xs font-medium">Welcome</span>
          </div>

          
        </div>
      </div>

      {/* Center - Search Bar - Hidden on mobile */}
      <div className="hidden lg:flex flex-1 max-w-md w-full mx-8">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-white/10 py-2.5 px-5 h-[52px] pl-12 rounded-[40px] text-white text-xs placeholder-white/70"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <DashboardSearchIcon />
          </div>
        </div>
      </div>

      {/* Right side */}
      <ProfilePill
      hasProfile={hasProfile}
      avatar={avatar}
      initial={initial}
      onOpenProfile={onOpenProfile}
       />
      
    </div>
  );
};

export default Navbar;
