// src/ui/ProfileModalProvider.tsx
/* eslint-disable react-refresh/only-export-components */
import React from "react";
import { createPortal } from "react-dom";

type SelectedProfile = {
  name: string;
  avatar: string;
  backgroundImage?: string;
  username?: string;
  ranking?: number;
};

type ModalState = {
  isOpen: boolean;
  selectedProfile: SelectedProfile | null;
  open: (p: SelectedProfile) => void;
  close: () => void;
};

const ProfileModalCtx = React.createContext<ModalState | undefined>(undefined);

export const useProfileModal = () => {
  const ctx = React.useContext(ProfileModalCtx);
  if (!ctx) throw new Error("useProfileModal must be used within <ProfileModalProvider>");
  return ctx;
};

export const ProfileModalProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isOpen, setOpen] = React.useState(false);
  const [selectedProfile, setSelected] = React.useState<SelectedProfile | null>(null);
  const [mounted, setMounted] = React.useState(false);

  const open = React.useCallback((p: SelectedProfile) => {
    setSelected(p);
    setOpen(true);
  }, []);
  const close = React.useCallback(() => setOpen(false), []);

  // mount flag for portal
  React.useEffect(() => setMounted(true), []);

  // Close on ESC
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <ProfileModalCtx.Provider value={{ isOpen, selectedProfile, open, close }}>
      {children}
      {mounted && createPortal(<ProfileModal />, document.body)}
    </ProfileModalCtx.Provider>
  );
};

const ProfileModal: React.FC = () => {
  const { isOpen, selectedProfile, close } = useProfileModal();
  if (!isOpen || !selectedProfile) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4"
      onClick={close}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-[#040C33] rounded-2xl w-[820px] max-w-[95vw] max-h-[85vh] overflow-hidden shadow-xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-xl font-bold">Profile</h2>
          <button
            onClick={close}
            className="text-white/80 hover:text-white focus:outline-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Banner */}
        <div
          className="h-[140px] relative"
          style={{
            backgroundImage: `url(${selectedProfile.backgroundImage ?? ""})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Top Row: avatar | details | stats */}
        <div className="px-6 pb-6">
          <div className="-mt-12 flex items-center gap-4">
            {/* Avatar */}
            <div className="w-[96px] h-[96px] rounded-full border-2 border-white overflow-hidden shrink-0 bg-white/5">
              <img
                src={selectedProfile.avatar}
                alt={selectedProfile.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const el = e.currentTarget as HTMLImageElement;
                  if (el.src.includes("/svg")) el.src = el.src.replace("/svg", "/png");
                }}
              />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-medium truncate">{selectedProfile.name}</h3>
              <div className="mt-2.5 flex gap-6 text-sm">
                <div>
                  <p className="text-white/50 text-[10px] font-medium">Workshop Attended</p>
                  <p className="text-white/80">—</p>
                </div>
                <div>
                  <p className="text-white/50 text-[10px] font-medium">Won</p>
                  <p className="text-white/80">🥇 —</p>
                </div>
                <div>
                  <p className="text-white/50 text-[10px] font-medium">State</p>
                  <p className="text-white/80">—</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-white text-sm font-medium">{selectedProfile.ranking ?? 0}</p>
                  <p className="text-white/50 text-[10px] font-medium">Invites</p>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">—</p>
                  <p className="text-white/50 text-[10px] font-medium">Referral Counts</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* (Optional) extra sections… */}
      </div>
    </div>
  );
};
