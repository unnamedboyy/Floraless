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

  const groups = [
    {
      title: "MAIN MENU",
      items: [
        menu.find((m) => m.label === "Dashboard"),
      ].filter(Boolean),
    },

    {
      title: "MASTER",
      items: menu.filter((m) =>
        [
          "Pegawai",
          "Pelanggan",
          "Layanan",
          "Jadwal",
        ].includes(m.label)
      ),
    },

    {
      title: "TRANSACTION",
      items: menu.filter((m) =>
        [
          "Ticket",
          "Payment",
          "Cashback",
          "Voucher",
          "Tugas",
        ].includes(m.label)
      ),
    },

    {
      title: "CONTENT",
      items: menu.filter((m) =>
        [
          "Review",
          "Portfolio",
        ].includes(m.label)
      ),
    },

    {
      title: "REPORT",
      items: menu.filter((m) =>
        [
          "Laporan",
        ].includes(m.label)
      ),
    },
  ];

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
        <div className="flex-1 overflow-y-auto px-3 py-2">
          {groups.map((group) => (
            <div key={group.title} className="mb-6">

              {!collapsed && (
                <>
                  <p className="px-3 mb-2 text-[11px] uppercase tracking-[0.18em] font-semibold text-gray-400">
                    {group.title}
                  </p>

                  <div className="border-t border-gray-100 mb-2"></div>
                </>
              )}

              <div className="space-y-2">
                {group.items.map((item) => {
                  const active = pathname === item.path;

                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`
                        group flex items-center gap-3
                        px-4 py-3 rounded-xl
                        transition

                        ${
                          active
                            ? "bg-black text-white shadow"
                            : "text-gray-500 hover:bg-gray-100"
                        }
                      `}
                    >
                      <span className="text-lg">
                        {item.icon}
                      </span>

                      {!collapsed && (
                        <span className="font-medium">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
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