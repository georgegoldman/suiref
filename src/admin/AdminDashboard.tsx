// src/admin/AdminDashboard.tsx
import React from "react";
import AdminHeader from "./AdminHeader";
import AdminEventForm from "./AdminEventForm";
import AdminHistory from "./AdminHistory";

type AdminView = "create" | "history";

export default function AdminDashboard() {
  const [activeView, setActiveView] = React.useState<AdminView>("create");

  return (
    <div className="min-h-screen px-8 bg-[#030B27] text-white">
      <div className="pt-6">
        <AdminHeader activeView={activeView} onViewChange={setActiveView} />
      </div>
      {/* Centered page container */}
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Main content area */}
        <div className="mt-6">
          {activeView === "create" ? <AdminEventForm /> : <AdminHistory />}
        </div>
      </div>
    </div>
  );
}
