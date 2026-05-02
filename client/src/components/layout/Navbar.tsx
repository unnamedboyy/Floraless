"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { user, role, isLoggedIn, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sembunyikan navbar di halaman admin/pegawai (punya sidebar sendiri)
  if (role === "admin" || role === "pelanggan" && pathname.startsWith("/pelanggan/")) return null;

  const menu: [string, string][] = [
    ["Beranda", "/"],
    ["Tentang", "/tentang"],
    ["Layanan", "/layanan"],
    ["FAQ", "/faq"],
    ["Kontak", "/kontak"],
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const textColor = scrolled ? "text-black" : "text-white";
  const underlineColor = scrolled ? "bg-black" : "bg-white";

  return (
    <header className="fixed inset-x-0 top-3 z-50 transition-all duration-500">
      <div className={`mx-auto flex max-w-7xl items-center justify-between px-6 py-5 transition-all duration-500 ${
        scrolled ? "mt-6 rounded-full bg-white/40 backdrop-blur-2xl border border-black/5 px-8" : "bg-transparent"
      }`}>

        {/* LOGO */}
        <Link href="/" className={`text-sm font-semibold tracking-[0.4em] transition ${textColor}`}>
          FLORALESS
        </Link>

        {/* MENU DESKTOP */}
        <nav className={`hidden md:flex items-center gap-8 text-sm font-medium transition ${textColor}`}>
          {menu.map(([name, link]) => (
            <Link key={name} href={link} className="relative group transition">
              {name}
              <span className={`absolute left-0 -bottom-1 h-[1px] w-0 transition-all duration-300 group-hover:w-full ${underlineColor}`}/>
            </Link>
          ))}

          {/* Tambahan menu untuk pelanggan login */}
          {isLoggedIn && role === "pelanggan" && (
            <>
              <Link href="/pelanggan/ticket" className="relative group">
                Tiket Saya
                <span className={`absolute left-0 -bottom-1 h-[1px] w-0 transition-all duration-300 group-hover:w-full ${underlineColor}`}/>
              </Link>
              <Link href="/pelanggan/ticket/buat" className="relative group">
                Pesan
                <span className={`absolute left-0 -bottom-1 h-[1px] w-0 transition-all duration-300 group-hover:w-full ${underlineColor}`}/>
              </Link>
            </>
          )}
        </nav>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              <Link href="/login" className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
                scrolled ? "border border-black/20 text-black hover:bg-black/5" : "border border-white/40 text-white hover:bg-white/10"
              }`}>
                Login
              </Link>
              <Link href="/register" className="rounded-full bg-[#C9AE63] px-5 py-2 text-xs font-semibold text-white hover:opacity-90 transition">
                Daftar
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {/* Avatar + nama */}
              <Link href={role === "pelanggan" ? "/" : `/${role}/dashboard`}
                className={`flex items-center gap-2 text-xs font-semibold transition ${textColor}`}>
                <div className="w-7 h-7 rounded-full bg-[#C9AE63] flex items-center justify-center text-white text-[11px] font-bold">
                  {(user?.username?.[0] ?? "U").toUpperCase()}
                </div>
                {user?.username}
              </Link>
              <button onClick={handleLogout}
                className="rounded-full border border-red-400/50 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-400 hover:text-white transition">
                Keluar
              </button>
            </div>
          )}
        </div>

        {/* HAMBURGER MOBILE */}
        <button className={`md:hidden p-2 ${textColor}`} onClick={() => setMenuOpen(!menuOpen)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
            }
          </svg>
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mx-4 mt-2 rounded-2xl bg-white shadow-xl border border-neutral-100 p-6 md:hidden">
          {menu.map(([name, link]) => (
            <Link key={name} href={link} onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-sm font-medium text-neutral-800 border-b border-neutral-100 last:border-0">
              {name}
            </Link>
          ))}
          {isLoggedIn && role === "pelanggan" && (
            <>
              <Link href="/pelanggan/ticket" onClick={() => setMenuOpen(false)}
                className="block py-2.5 text-sm font-medium text-neutral-800 border-b border-neutral-100">
                Tiket Saya
              </Link>
              <Link href="/pelanggan/ticket/buat" onClick={() => setMenuOpen(false)}
                className="block py-2.5 text-sm font-medium text-neutral-800 border-b border-neutral-100">
                Pesan Sekarang
              </Link>
            </>
          )}
          <div className="mt-4 flex flex-col gap-2">
            {!isLoggedIn ? (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)}
                  className="text-center rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-semibold">Login</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)}
                  className="text-center rounded-full bg-[#C9AE63] px-5 py-2.5 text-sm font-semibold text-white">Daftar</Link>
              </>
            ) : (
              <button onClick={handleLogout}
                className="rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white">
                Keluar
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}