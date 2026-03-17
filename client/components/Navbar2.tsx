"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return <header className="fixed inset-x-0 top-0 z-50 h-[80px]" />;
  }

  if (user?.role === "admin") {
    return null;
  }

  const menu = [
    ["Beranda", "/"],
    ["Tentang", "/tentang"],
    ["Layanan", "/layanan"],
    ["FAQ", "/faq"],
    ["Kontak", "/kontak"],
  ];

  return (
    <header className="fixed inset-x-0 top-3 z-50 transition-all duration-500">
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-6 py-5 transition-all duration-500 ${
          scrolled
            ? "mt-6 rounded-full bg-white/40 backdrop-blur-2xl border border-black/5 px-8"
            : "bg-transparent"
        }`}
      >
        {/* LOGO */}
        <Link
          href="/"
          className={`text-sm font-semibold tracking-[0.4em] transition ${
            scrolled ? "text-black" : "text-white"
          }`}
        >
          FLORALESS
        </Link>

        {/* MENU */}
        <nav
          className={`hidden md:flex items-center gap-8 text-sm font-medium transition ${
            scrolled ? "text-black" : "text-white"
          }`}
        >
          {menu.map(([name, link]) => (
            <Link
              key={name}
              href={link}
              className="relative group transition"
            >
              {name}

              <span
                className={`absolute left-0 -bottom-1 h-[1px] w-0 transition-all duration-300 group-hover:w-full ${
                  scrolled ? "bg-black" : "bg-white"
                }`}
              />
            </Link>
          ))}

          {user?.role === "pelanggan" && (
            <>
              <Link href="/user/bookings" className="relative group">
                Booking
                <span
                  className={`absolute left-0 -bottom-1 h-[1px] w-0 transition-all duration-300 group-hover:w-full ${
                    scrolled ? "bg-black" : "bg-white"
                  }`}
                />
              </Link>

              <Link href="/user/tickets" className="relative group">
                Transaksi
                <span
                  className={`absolute left-0 -bottom-1 h-[1px] w-0 transition-all duration-300 group-hover:w-full ${
                    scrolled ? "bg-black" : "bg-white"
                  }`}
                />
              </Link>
            </>
          )}
        </nav>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <Link
                href="/login"
                className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
                  scrolled
                    ? "border border-black/20 text-black hover:bg-black/5"
                    : "border border-white/40 text-white hover:bg-white/10"
                }`}
              >
                Login
              </Link>

              <Link
                href="/login"
                className="rounded-full bg-[#C9AE63] px-5 py-2 text-xs font-semibold text-white hover:opacity-90 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <span
                className={`text-xs font-semibold ${
                  scrolled ? "text-black" : "text-white"
                }`}
              >
                Halo, {user.username}
              </span>

              <button
                onClick={logout}
                className="rounded-full bg-red-500 px-5 py-2 text-xs font-semibold text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}