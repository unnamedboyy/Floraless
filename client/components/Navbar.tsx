"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout, loading } = useAuth();

  // ⏳ Saat loading tetap render header kosong biar layout stabil
  if (loading) {
    return (
      <header className="fixed inset-x-0 top-0 z-50 bg-black/80 h-[72px]" />
    );
  }

  // 👑 Kalau admin login → jangan tampilkan navbar sama sekali
  if (user?.role === "admin") {
    return null;
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-white">
        
        <Link href="/" className="text-sm font-semibold tracking-widest">
          FLORALESS
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/">Beranda</Link>
          <Link href="/#packages">Layanan</Link>
          <Link href="/#schedule">Galeri</Link>
          <Link href="/tentang">Tentang</Link>
          <Link href="/kontak">Kontak</Link>

          {user?.role === "pelanggan" && (
            <>
              <Link href="/user/calendar">Jadwal</Link>
              <Link href="/user/bookings">Tiket</Link>
              <Link href="/user/chat">Chat</Link>
            </>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <Link
                href="/login"
                className="rounded-full border border-white/40 px-4 py-2 text-xs font-semibold hover:bg-white/10"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-neutral-900 hover:bg-white/90"
              >
                Register
              </Link>
            </>
          ) : user.role === "pelanggan" ? (
            <>
              <span className="text-xs">
                Halo, {user.username}
              </span>
              <button
                onClick={async () => {
                  await logout();
                }}
                className="rounded-full bg-red-500 px-4 py-2 text-xs font-semibold hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}