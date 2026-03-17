"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Hero() {

  const cards = [
    "/gal-1.jpg",
    "/gal-2.jpg",
    "/gal-3.jpg",
    "/gal-4.jpg"
  ];

  const allCards = [...cards, ...cards];

  const [index, setIndex] = useState(0);

  const nextSlide = () => {
    setIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-white py-6">
      <div className="mx-auto px-6">

        <div className="relative h-[75vh] overflow-hidden rounded-[25px] shadow-[0_30px_80px_rgba(0,0,0,0.18)]">

          {/* BACKGROUND */}
          <Image
            src="/hero.jpg"
            alt="Floraless Decoration"
            fill
            priority
            className="object-cover scale-[1.02]"
          />

          {/* GRADIENT */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

          {/* LEFT CONTENT */}
          <div className="absolute left-16 top-6/10 max-w-xl -translate-y-1/2 text-white">

            <h1 className="text-5xl font-semibold leading-[1.1] md:text-6xl">
              Dekorasi Gereja
              <br />
              Elegan & Sakral
            </h1>

            <p className="mt-6 text-base text-white/80 leading-relaxed">
              Kami menghadirkan dekorasi bunga yang sakral dan elegan untuk
              pernikahan serta berbagai acara istimewa di Yogyakarta.
            </p>

            <div className="mt-10 flex items-center gap-6">
              <Link
                href="/user/calendar"
                className="rounded-full bg-[#C9AE63] px-8 py-4 text-sm font-semibold text-white hover:opacity-90"
              >
                Booking Sekarang
              </Link>

              <Link
                href="/kontak"
                className="rounded-full border border-white px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Konsultasi gratis
              </Link>
            </div>

          </div>

          {/* RIGHT CARDS */}
          <div className="absolute right-12 top-1/2 hidden -translate-y-1/2 md:block">

            <div className="relative w-[540px] overflow-hidden">

              <div
                className="flex gap-6 transition-transform duration-700 ease-out"
                style={{
                  transform: `translateX(-${index * 260}px)`
                }}
              >
                {allCards.map((img, i) => (
                  <div
                    key={i}
                    className="relative h-[360px] w-[220px] flex-shrink-0 overflow-hidden rounded-[22px] shadow-2xl"
                  >
                    <Image
                      src={img}
                      alt="gallery"
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-black/20" />
                  </div>
                ))}
              </div>

            </div>

          </div>

          {/* CONTROLS */}
          <div className="absolute bottom-10 right-14 flex items-center gap-6 text-white">

            {/* ARROWS */}
            <div className="flex items-center gap-3">

              <button
                onClick={prevSlide}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 hover:bg-white/10"
              >
                ←
              </button>

              <button
                onClick={nextSlide}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 hover:bg-white/10"
              >
                →
              </button>

            </div>

            {/* LINE */}
            <div className="relative h-[2px] w-[350px] bg-white/30">

              <div
                className="absolute left-0 top-0 h-full bg-white transition-all duration-500"
                style={{
                  width: `${((index % cards.length) + 1) * 25}%`
                }}
              />

            </div>

            {/* NUMBER */}
            <div className="text-lg font-semibold">
              {String((index % cards.length) + 1).padStart(2, "0")}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}