"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

/* ================= TYPES ================= */

type Role = "admin" | "pegawai";

type MenuItem = {
  label: string;
  path: string;
  roles: Role[];
};

type Props = {
  title: string;
  menu: MenuItem[];
  onLogout: () => void;
};

/* ================= COMPONENT ================= */

export default function Sidebar({ title, menu, onLogout }: Props) {
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    setMounted(true);
    const r = Cookies.get("role") as Role | undefined;
    setRole(r ?? null);
  }, []);

  if (!mounted) return null;

  const filteredMenu = menu.filter((item) =>
    role ? item.roles.includes(role) : false
  );

  return (
    <aside className="w-64 bg-white shadow-md p-4 min-h-screen">
      <h2 className="text-xl font-bold mb-6">{title}</h2>

      <nav className="flex flex-col gap-2">
        {filteredMenu.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`p-2 rounded transition ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={onLogout}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded w-full"
      >
        Logout
      </button>
    </aside>
  );
}