"use client";

import Sidebar from "@/components/layout/Sidebar";
import { adminMenu } from "@/constants/menu";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar menu={adminMenu} />

      <div className="flex-1 bg-gray-50 min-h-screen p-6">
        {children}
      </div>
    </div>
  );
}