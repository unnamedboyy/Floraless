"use client";

import Sidebar from "@/components/layout/Sidebar";
import { pegawaiMenu } from "@/constants/menu";

export default function PegawaiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar menu={pegawaiMenu} />

      <div className="flex-1 bg-gray-50 min-h-screen p-6">
        {children}
      </div>
    </div>
  );
}