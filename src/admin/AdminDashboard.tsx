// src/admin/AdminDashboard.tsx
import React from "react";
import AdminHeader from "./AdminHeader";
import AdminEventForm from "./AdminEventForm";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen px-8 bg-[#030B27] text-white">
        <div className="pt-6">
          <AdminHeader />
        </div>
      {/* Centered page container */}
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Top spacing matches mock */}

        {/* Main content area */}
        <div className="mt-6">
          <AdminEventForm />
        </div>
      </div>
    </div>
  );
}
