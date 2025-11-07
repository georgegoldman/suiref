// src/admin/AdminHeader.tsx
import React from "react";

type AdminView = "create" | "history";

interface AdminHeaderProps {
  activeView: AdminView;
  onViewChange: (view: AdminView) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeView,
  onViewChange,
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-6 text-sm font-medium">
        <button
          className={`hover:text-white ${
            activeView === "create" ? "text-white" : "text-white/60"
          }`}
          onClick={() => onViewChange("create")}
        >
          📅 Create Event
        </button>
        <button
          className={`hover:text-white ${
            activeView === "history" ? "text-white" : "text-white/60"
          }`}
          onClick={() => onViewChange("history")}
        >
          📜 History
        </button>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-white/70 text-xs">4:52 PM GMT+1</span>
        <button className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
          <img
            src="/avatars/admin.png"
            alt="profile"
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;
