"use client";

import Link from "next/link";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {

  const [scrolled, setScrolled] = useState(false);

  const [open, setOpen] = useState(false);

  const [user, setUser] = useState<any>(null);

  useEffect(() => {

    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );

  }, []);

  useEffect(() => {

    const stored = localStorage.getItem(
      "user"
    );

    if (stored) {
      setUser(JSON.parse(stored));
    }

  }, []);

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("profile");

    Cookies.remove("token");
    Cookies.remove("role");

    window.location.href = "/login";
  };

  const menu = [
    ["Beranda", "/"],
    ["Tentang", "tentang"],
    ["Galeri", "gallery"],
    ["Paket", "#packages"],
    ["Kontak", "kontak"],
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">

      <div
        className={`
          mx-auto
          max-w-7xl
          transition-all
          duration-500
          rounded-full
          border
          ${
            scrolled
              ? "border-white/10 bg-black/40 backdrop-blur-2xl"
              : "border-transparent bg-transparent"
          }
        `}
      >

        <div className="flex items-center justify-between px-6 py-4">

          <Link
            href="/"
            className="text-sm font-semibold tracking-[0.4em] text-white"
          >
            FLORALESS
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-sm text-white/80">
            {menu.map(([name, href]) => (
              <a
                key={name}
                href={href}
                className="hover:text-white transition"
              >
                {name}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">

            {!user ? (
              <>
                <Link
                  href="/login"
                  className="rounded-full border border-white/20 px-5 py-2 text-sm text-white hover:bg-white/10 transition"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="rounded-full bg-[#C9AE63] px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={`/${user.role}/dashboard`}
                  className="rounded-full border border-white/20 px-5 py-2 text-sm text-white hover:bg-white/10 transition"
                >
                  Dashboard
                </Link>

                <button
                  onClick={logout}
                  className="rounded-full bg-red-500 px-5 py-2 text-sm text-white hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            )}

          </div>

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-white"
          >
            {open ? <X /> : <Menu />}
          </button>

        </div>

      </div>

      {open && (
        <div className="lg:hidden mt-3 rounded-3xl border border-white/10 bg-black/70 backdrop-blur-2xl p-6 text-white">

          <div className="flex flex-col gap-5">

            {menu.map(([name, href]) => (
              <a
                key={name}
                href={href}
                onClick={() => setOpen(false)}
                className="text-sm text-white/80 hover:text-white"
              >
                {name}
              </a>
            ))}

            {!user ? (
              <>
                <Link href="/login">
                  Login
                </Link>

                <Link href="/register">
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link href={`/${user.role}/dashboard`}>
                  Dashboard
                </Link>

                <button
                  onClick={logout}
                  className="text-left text-red-400"
                >
                  Logout
                </button>
              </>
            )}

          </div>

        </div>
      )}

    </header>
  );
}
