"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };


  const menu = [
    { label: "Dashboard", href: "/user/dashboard" },
    { label: "Calendar", href: "/user/calendar" },
    { label: "My Bookings", href: "/user/bookings" },
    { label: "Chat", href: "/user/chat" },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Top Bar */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-sm font-semibold tracking-widest text-[#C9AE63]">
            FLORALESS
          </h1>

          <nav className="hidden gap-6 md:flex">
            {menu.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition ${
                    active
                      ? "text-[#C9AE63]"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

            <button
            onClick={handleLogout}
            className="rounded-full border border-neutral-300 px-4 py-2 text-xs font-semibold hover:bg-neutral-50"
            >
            Logout
            </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {children}
      </main>
    </div>
  );
}
