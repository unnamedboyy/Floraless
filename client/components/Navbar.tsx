"use client";

import { useState } from "react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Packages", href: "/#packages" },
  { label: "Schedule", href: "/#schedule" },
  { label: "Tentang", href: "/tentang" },
  { label: "Kontak", href: "/kontak" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="bg-black/30 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="/" className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-widest text-white/90">
              FLORALESS
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((it) => (
              <a
                key={it.href}
                href={it.href}
                className="text-xs font-medium tracking-widest text-white/80 hover:text-white"
              >
                {it.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href="/customer"
              className="rounded-full border border-white/40 px-4 py-2 text-xs font-semibold text-white/90 hover:bg-white/10"
            >
              Login
            </a>
            <a
              href="/customer"
              className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-neutral-900 hover:bg-white/90"
            >
              Register
            </a>
          </div>

          <button
            className="md:hidden rounded-lg border border-white/30 px-3 py-2 text-xs font-semibold text-white"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            Menu
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-white/10">
            <div className="mx-auto max-w-6xl px-4 py-4">
              <div className="flex flex-col gap-3">
                {navItems.map((it) => (
                  <a
                    key={it.href}
                    href={it.href}
                    onClick={() => setOpen(false)}
                    className="text-sm font-medium text-white/85 hover:text-white"
                  >
                    {it.label}
                  </a>
                ))}

                <div className="mt-3 flex gap-2">
                  <a
                    href="/customer"
                    className="flex-1 rounded-full border border-white/40 px-4 py-2 text-center text-xs font-semibold text-white/90 hover:bg-white/10"
                  >
                    Login
                  </a>
                  <a
                    href="/customer"
                    className="flex-1 rounded-full bg-white px-4 py-2 text-center text-xs font-semibold text-neutral-900 hover:bg-white/90"
                  >
                    Register
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
