// src/admin/AdminHeader.tsx
import React from "react";
import { useUser } from "../session-data";

const AdminHeader: React.FC = () => {
  const { avatar } = useUser();
  

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-6 text-sm font-medium text-white/90">
        <button className="hover:text-white">📅 Create Event</button>
        <button className="hover:text-white">📜 History</button>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-white/70 text-xs">4:52 PM GMT+1</span>
        <button 
        onClick={() => console.log(avatar)}
        className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
          <img
            src={avatar?? ""}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;
