import DashboardSearchIcon from "../assets/dashboard-search-icon";
// import DashboardNotificationIcon from "../assets/dashboard-notification-icon";
// import DashboardDropdownIcon from "../assets/dashboard-dropdown-icon";
import { useUser } from "../session-data";
import { CopyButton } from "./CopyButton";

function shortAddr(addr?: string | null) {
  return addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "";
}

const Navbar = () => {
  const { username, avatar, address, hasProfile } = useUser();

  const displayName = username ?? shortAddr(address);
  const initial = (username ?? address ?? "?").slice(0, 1).toUpperCase();

  return (
    <div className="flex justify-between items-center py-5 px-8 bg-[#040c33] border-b border-white/10">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-white/70 text-xs font-medium">Hey!</span>
          <span>👋</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-white text-[24px] font-bold">{displayName}</span>
          {/* Copy full address regardless of username being shown */}
          <CopyButton value={address} />
        </div>
      </div>

      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-white/10 py-2.5 px-5 h-[52px] pl-12 rounded-[40px] text-white text-xs placeholder-white/70"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <DashboardSearchIcon />
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2.5">
        {hasProfile && avatar ? (
          <img
            src={avatar}
            alt="avatar"
            className="w-[40px] h-[40px] rounded-full object-cover"
            onError={(e) => {
              const el = e.currentTarget as HTMLImageElement;
              if (el.src.includes("/svg")) el.src = el.src.replace("/svg", "/png");
            }}
            decoding="async"
            loading="lazy"
          />
        ) : (
          <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-r from-[#1DA1F2] to-[#1DA1F2]/80 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">{initial}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
