
type Props = {
  hasProfile: boolean;
  avatar?: string | null;
  initial: string;
  onOpenProfile: () => void;
  isMenuOpen?: boolean; // optional, for aria-expanded
};

export function ProfilePill({
  hasProfile,
  avatar,
  initial,
  onOpenProfile,
  isMenuOpen = false,
}: Props) {
  return (
    <button
      onClick={onOpenProfile}
      className="
        inline-flex items-center gap-2
        h-11 pl-1.5 pr-2
        rounded-full
        bg-white/5 hover:bg-white/10
        ring-1 ring-white/10
        transition-colors
        focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40
      "
      aria-haspopup="menu"
      aria-expanded={isMenuOpen}
      aria-label="Open profile menu"
    >
      {/* Avatar */}
      {hasProfile && avatar ? (
        <span className="h-9 w-9 rounded-full overflow-hidden bg-white/10 shrink-0">
          <img
            src={avatar}
            alt="avatar"
            className="h-full w-full object-cover"
            onError={(e) => {
              const el = e.currentTarget as HTMLImageElement;
              if (el.src.includes("/svg")) el.src = el.src.replace("/svg", "/png");
            }}
            decoding="async"
            loading="lazy"
          />
        </span>
      ) : (
        <span
          className="
            h-9 w-9 rounded-full grid place-items-center shrink-0
            bg-gradient-to-r from-[#1DA1F2] to-[#1DA1F2]/80
            text-white font-semibold text-base
          "
          aria-hidden="true"
        >
          {initial}
        </span>
      )}

      {/* Chevron */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        className="opacity-80"
        aria-hidden="true"
      >
        <path
          d="M6 9l6 6 6-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
