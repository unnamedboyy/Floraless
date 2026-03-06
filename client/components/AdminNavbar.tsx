"use client";

import { Search, Bell, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminNavbar() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <div className="flex items-center justify-between p-10">

      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-semibold">
          Dashboard
        </h1>

        <p className="text-sm text-neutral-500">
          Monitor aktivitas booking Floraless
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">

        {/* SEARCH */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-2.5 text-neutral-400"
          />

          <input
            placeholder="Search..."
            className="border rounded-full pl-8 pr-3 py-1.5 text-sm"
          />
        </div>

        {/* NOTIFICATION */}
        <Bell size={20} className="text-neutral-500" />

        {/* AVATAR */}
        <div className="w-8 h-8 bg-neutral-200 rounded-full" />

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </div>
  );
}