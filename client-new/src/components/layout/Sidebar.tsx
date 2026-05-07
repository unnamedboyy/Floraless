"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ChevronLeft } from "lucide-react";

export default function Sidebar({ menu }: { menu: any[] }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="h-screen bg-[#f5f7fb] p-4">
      <div
        className={`h-full bg-white rounded-2xl shadow-sm flex flex-col transition-all duration-300
        ${collapsed ? "w-[90px]" : "w-[260px]"}`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-5">
          {!collapsed && (
            <h1 className="font-semibold text-lg tracking-wide">
              Floraless
            </h1>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 flex items-center justify-center rounded-full border bg-white shadow-sm hover:bg-gray-100 transition"
          >
            <ChevronLeft
              size={18}
              className={`transition-transform duration-300 ${
                collapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* MENU */}
        <div className="flex-1 px-3 space-y-2">
          {menu.map((item) => {
            const active = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition
                  
                  ${
                    active
                      ? "bg-black text-white shadow-sm"
                      : "text-gray-500 hover:bg-gray-100"
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>

                {!collapsed && (
                  <span className="font-medium">
                    {item.label}
                  </span>
                )}

                {/* TOOLTIP */}
                {collapsed && (
                  <span className="absolute left-[80px] bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="p-3">
          <button
            onClick={logout}
            className="w-full bg-gray-900 text-white py-3 rounded-xl text-sm hover:opacity-90 transition"
          >
            {collapsed ? "⎋" : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
}