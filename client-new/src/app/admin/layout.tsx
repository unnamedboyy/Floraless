"use client";

import Sidebar from "@/components/layout/Sidebar";
import { adminMenu } from "@/constants/menu";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#f5f7fb]">

      {/* SIDEBAR */}
      <aside
        className="
          fixed
          left-0
          top-0
          h-screen
          w-[280px]
          bg-white
        "
      >
        <Sidebar menu={adminMenu} />
      </aside>

      {/* CONTENT */}
      <main className="ml-[280px] min-h-screen">
        {children}
      </main>

    </div>
  );
}