"use client";

import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/layout/Sidebar";
import { adminMenu } from "@/constants/menu";

type Props = {
  children: ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar title="Admin Panel" menu={adminMenu} onLogout={logout} />

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}