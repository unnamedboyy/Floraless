"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar({ menu }: { menu: any[] }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`h-screen bg-white border-r transition-all duration-300 relative
      ${collapsed ? "w-[80px]" : "w-[240px]"}`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <h1 className="font-bold text-lg">Floraless</h1>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-sm px-2 py-1 border rounded"
        >
          {collapsed ? ">" : "<"}
        </button>
      </div>

      {/* MENU */}
      <div className="p-2 space-y-1">
        {menu.map((item) => {
          const active = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`group flex items-center gap-3 p-3 rounded transition relative
                ${active ? "bg-blue-500 text-white" : "hover:bg-gray-100"}
              `}
            >
              {/* ICON */}
              <span>{item.icon}</span>

              {/* TEXT */}
              {!collapsed && <span>{item.label}</span>}

              {/* TOOLTIP */}
              {collapsed && (
                <span className="absolute left-[70px] bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* LOGOUT */}
      <div className="absolute bottom-0 w-full p-3">
        <button className="w-full bg-red-500 text-white py-2 rounded">
          {collapsed ? "⎋" : "Logout"}
        </button>
      </div>
    </div>
  );
}