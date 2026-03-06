"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  Package,
  MessageCircle,
  Settings,
} from "lucide-react";

export default function AdminSidebar() {
  return (
    <aside className="fixed top-0 left-0 w-20 h-screen bg-[#0A0A0A] border-r border-neutral-800 flex flex-col items-center py-6 z-50">

      {/* LOGO */}
      <div className="mb-12 text-white font-bold text-sm tracking-widest">
        F
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-col gap-8">

        <Link href="/admin/dashboard">
          <LayoutDashboard className="text-neutral-400 hover:text-white transition" />
        </Link>

        <Link href="/admin/tickets">
          <Calendar className="text-neutral-400 hover:text-white transition" />
        </Link>

        <Link href="/admin/calendar">
          <Calendar className="text-neutral-400 hover:text-white transition" />
        </Link>

        <Link href="/admin/layanan">
          <Package className="text-neutral-400 hover:text-white transition" />
        </Link>

        <Link href="/admin/chat">
          <MessageCircle className="text-neutral-400 hover:text-white transition" />
        </Link>

        <Link href="/admin/settings">
          <Settings className="text-neutral-400 hover:text-white transition" />
        </Link>

      </nav>

    </aside>
  );
}