"use client";

import { Sidebar } from "~/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#09090B]">
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-auto">
        {children}
      </div>
    </div>
  );
}