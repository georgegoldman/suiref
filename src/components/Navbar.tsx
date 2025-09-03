import { HiMenu } from "react-icons/hi";
import DashboardSearchIcon from "../assets/dashboard-search-icon";
import { useUser } from "../session-data";
import { CopyButton } from "./CopyButton";
import { useProfileModal } from "../ui/ProfileModalProvider";

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
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-white/70 text-xs font-medium">Hey!</span>
            <span>👋</span>
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2">
            <span className="text-white text-[18px] lg:text-[24px] font-bold">
              {displayName}
            </span>
            <CopyButton value={address} />
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
      <div className="flex items-center gap-2.5">
        {/* Mobile: Hey! and waving hand beside avatar */}
        <div className="lg:hidden flex items-center gap-[0rem]">
          <span className="text-white/70 text-xs font-medium">Hey!</span>
          <span>👋</span>
        </div>

        {hasProfile && avatar ? (
          <button onClick={onOpenProfile} className="rounded-full">
            <img
              src={avatar}
              alt="avatar"
              className="w-[40px] h-[40px] rounded-full object-cover"
              onError={(e) => {
                const el = e.currentTarget as HTMLImageElement;
                if (el.src.includes("/svg"))
                  el.src = el.src.replace("/svg", "/png");
              }}
              decoding="async"
              loading="lazy"
            />
          </button>
        ) : (
          <button
            onClick={onOpenProfile}
            className="w-[40px] h-[40px] rounded-full bg-gradient-to-r from-[#1DA1F2] to-[#1DA1F2]/80 flex items-center justify-center"
          >
            <span className="text-white font-semibold text-lg">{initial}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
