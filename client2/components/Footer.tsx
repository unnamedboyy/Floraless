"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function Footer() {

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
    <footer className="bg-neutral-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="text-sm font-semibold tracking-widest">FLORALESS</div>
            <p className="mt-4 text-sm text-white/70">
              Lorem ipsum dolor sit amet consectetur. Amet sed nulla. Vulputate quis viverra.
            </p>
            <p className="mt-6 text-xs text-white/50">© 2026 Floraless</p>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-sm font-semibold">Menu</h4>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li><a href="/" className="hover:text-white">Beranda</a></li>
              <li><a href="/tentang" className="hover:text-white">Tentang</a></li>
              <li><a href="/kontak" className="hover:text-white">Kontak</a></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-sm font-semibold">Kontak</h4>
            <div className="mt-3 space-y-2 text-sm text-white/70">
              <p>floraless@email.com</p>
              <p>+62 856-4040-6548</p>
              <p>Babarsari, Yogyakarta</p>
            </div>

            <a
              href="https://wa.me/6285640406548"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-full bg-[#25D366] px-5 py-3 text-xs font-semibold text-neutral-950 hover:opacity-90"
            >
              Chat via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
