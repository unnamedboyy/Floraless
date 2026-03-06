"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="home" className="relative overflow-hidden">
      <div className="relative h-[100vh] min-h-[680px] w-full">
        
        {/* PARALLAX IMAGE */}
        <div
          className="absolute inset-0 scale-110"
          style={{
            transform: `translateY(${offset * 0.25}px)`
          }}
        >
          <Image
            src="/hero.jpg"
            alt="Hero"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/50" />

        {/* CONTENT */}
        <div className="relative mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-4 text-center">
          <p className="mb-3 text-[11px] tracking-[0.35em] text-white/80">
            FLOWER ARRANGEMENT
          </p>

          <h1 className="max-w-m text-5xl font-semibold leading-tight text-white md:text-7xl">
            Dekorasi Gereja & Event
            <br className="hidden md:block" /> Yogyakarta
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/75 md:text-base">
            Mewujudkan dekorasi sakral dan elegan untuk hari istimewa Anda.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/user/calendar"
              className="rounded-full bg-[#C9AE63] px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Booking Sekarang
            </Link>

            <Link
              href="/#packages"
              className="rounded-full border border-white px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Lihat Paket
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}