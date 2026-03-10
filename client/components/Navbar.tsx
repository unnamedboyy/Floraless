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
    return <header className="fixed inset-x-0 top-0 z-50 h-[72px]" />;
  }

  if (user?.role === "admin") {
    return null;
  }

  return (
      <header
        className={`fixed inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "top-0 bg-white/10 backdrop-blur-xl border-b border-white/10 shadow-lg"
            : "top-5 bg-transparent"
        }`}
      >

        
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-white">
        
        {/* LOGO */}
        <Link
          href="/"
          className="text-sm font-semibold tracking-[0.3em]"
        >
          FLORALESS
        </Link>

        {/* MENU */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {[
            ["Beranda", "/"],
            ["Tentang", "/tentang"],
            ["Layanan", "/#packages"],
            ["FAQ", "/faq"],
            ["Kontak", "/kontak"],
            // ["Galeri", "/#schedule"],
          ].map(([name, link]) => (
            <Link
              key={name}
              href={link}
              className="relative after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-white after:transition-all hover:after:w-full"
            >
              {name}
            </Link>
          ))}

          {user?.role === "pelanggan" && (
            <>
              <Link
                href="/user/calendar"
                className="relative after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-white after:transition-all hover:after:w-full"
              >
                Kalender
              </Link>

              <Link
                href="/user/tickets"
                className="relative after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-white after:transition-all hover:after:w-full"
              >
                Transaksi
              </Link>

              {/* <Link
                href="/user/chat"
                className="relative after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-white after:transition-all hover:after:w-full"
              >
                Chat
              </Link> */}
            </>
          )}
        </nav>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <Link
                href="/login"
                className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold hover:bg-white/10 transition"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-white/90 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="text-xs font-semibold">
                Halo, {user.username}
              </span>

              <button
                onClick={logout}
                className="rounded-full bg-red-500 px-4 py-2 text-xs font-semibold hover:bg-red-600 transition"
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