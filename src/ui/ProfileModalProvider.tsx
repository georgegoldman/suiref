/* eslint-disable react-refresh/only-export-components */
import React from "react";

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

  const open = React.useCallback((p: SelectedProfile) => {
    setSelected(p);
    setOpen(true);
  }, []);
  const close = React.useCallback(() => setOpen(false), []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <ProfileModalCtx.Provider value={{ isOpen, selectedProfile, open, close }}>
      {children}
      <ProfileModal />
    </ProfileModalCtx.Provider>
  );
};

const ProfileModal: React.FC = () => {
  const { isOpen, selectedProfile, close } = useProfileModal();
  if (!isOpen || !selectedProfile) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={close}
    >
      <div
        className="bg-[#040C33] rounded-[20px] w-full max-w-[960px] h-[620px] max-h-[80vh] overflow-hidden relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (fixed) */}
        <div className="flex items-center justify-between h-[72px] px-8 border-b border-white/10">
          <h2 className="text-2xl font-bold flex-1 flex justify-center">Profile</h2>
          <button onClick={close} className="text-white hover:text-gray-300 transition-colors">✕</button>
        </div>

        {/* Banner (fixed) */}
        <div
          className="h-[128px] shrink-0"
          style={{
            backgroundImage: `url(${selectedProfile.backgroundImage ?? ""})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Top Row (fills remaining height) */}
        <div className="flex-1 px-8 pt-0 pb-0 overflow-hidden">
          <div className="-mt-12 h-full flex items-center overflow-hidden">
            {/* Avatar — slight space before details */}
            <div className="w-[128px] h-[128px] rounded-[24px] border-2 border-white overflow-hidden shrink-0 bg-white/5 mr-6">
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

            {/* Details — very small space before stats */}
            <div className="flex-1 min-w-0 mr-2">
              <h3 className="text-2xl font-medium truncate">{selectedProfile.name}</h3>
              <div className="mt-3 flex flex-col gap-2">
                <p className="text-white/50 text-[11px] font-medium">Workshop Attended</p>
                <p className="text-white/80 text-base font-medium">—</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1 min-w-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <p className="text-white/50 text-[11px] font-medium flex items-center gap-1">
                    Won <span>🥇</span>
                  </p>
                  <p className="text-white/80 text-base font-medium">—</p>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-white/50 text-[11px] font-medium">State</p>
                  <p className="text-white/80 text-base font-medium">—</p>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-white text-base font-medium flex items-center gap-1">
                    {selectedProfile.ranking ?? 0}
                  </p>
                  <p className="text-white/50 text-[11px] font-medium">Invites</p>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-white text-base font-medium">—</p>
                  <p className="text-white/50 text-[11px] font-medium">Referral Counts</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
