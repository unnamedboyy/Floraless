"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ Semua hook di paling atas
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/user/dashboard");
      }
    }
  }, [user, loading, router]);

  // ✅ Return setelah semua hook dipanggil
  if (loading || !user || user.role !== "admin") {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const menu = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Calendar", href: "/admin/calendar" },
    { label: "Tickets", href: "/admin/tickets" },
    { label: "Chat", href: "/admin/chat" },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-sm font-semibold tracking-widest text-[#C9AE63]">
            FLORALESS ADMIN
          </h1>
          <button
            onClick={handleLogout}
            className="rounded-full border border-neutral-300 px-4 py-2 text-xs font-semibold hover:bg-neutral-50"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl">
        <aside className="hidden w-56 border-r border-neutral-200 pt-6 md:block">
          <nav className="flex flex-col gap-2 px-4">
            {menu.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-[#C9AE63] text-white"
                      : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 px-6 py-8 bg-neutral-50">
          {children}
        </main>
      </div>
    </div>
  );
}