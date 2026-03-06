"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const data = [
  {
    name: "Nadira & Fajar",
    role: "Wedding Event",
    quote:
      "Pengalaman kami menggunakan Floraless benar-benar luar biasa. Proses booking lewat website sangat mudah karena bisa langsung memilih tanggal di kalender dan melihat ketersediaan.",
  },
  {
    name: "Rico Pratama",
    role: "Corporate Gathering",
    quote:
      "Kami menggunakan Floraless untuk acara corporate gathering kantor. Sistem booking online mereka sangat membantu karena semuanya transparan dan bisa dipantau dari dashboard.",
  },
  {
    name: "Salsa Putri",
    role: "Birthday Celebration",
    quote:
      "Saya suka sekali dengan kemudahan sistemnya. Dari register akun, booking tanggal, sampai komunikasi lewat fitur chat semuanya praktis dan nyaman digunakan.",
  },
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [pause, setPause] = useState(false);

  const next = () => {
    setDirection(1);
    setIdx((v) => (v + 1) % data.length);
  };

  const prev = () => {
    setDirection(-1);
    setIdx((v) => (v - 1 + data.length) % data.length);
  };

  const t = data[idx];

  useEffect(() => {
    if (pause) return;

    const interval = setInterval(() => {
      next();
    }, 6000);

    return () => clearInterval(interval);
  }, [pause]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 120 : -120,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -120 : 120,
      opacity: 0,
    }),
  };

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-24">

        <div className="grid md:grid-cols-12 gap-12 items-center">

          {/* LEFT */}
          <div className="md:col-span-4">

            <h2 className="text-3xl font-semibold leading-tight">
              Dari Mereka <br /> Untuk Floraless
            </h2>

            <p className="mt-4 text-sm text-neutral-600 leading-relaxed">
              Kepuasan klien adalah prioritas utama kami. Berikut pengalaman
              nyata dari mereka yang telah mempercayakan momen spesialnya
              bersama Floraless.
            </p>

            <div className="flex gap-3 mt-8">

              <button
                onClick={prev}
                className="h-10 w-10 rounded-full border border-neutral-300 hover:bg-neutral-50 transition"
              >
                ‹
              </button>

              <button
                onClick={next}
                className="h-10 w-10 rounded-full border border-neutral-300 hover:bg-neutral-50 transition"
              >
                ›
              </button>

            </div>

          </div>

          {/* RIGHT */}
          <div
            className="md:col-span-8 relative overflow-hidden"
            onMouseEnter={() => setPause(true)}
            onMouseLeave={() => setPause(false)}
          >
            
          {/* FADE LEFT */}
          {/* <div className="pointer-events-none absolute -left-16 top-0 h-full w-40 bg-gradient-to-r from-white to-transparent z-10" /> */}

          {/* FADE RIGHT */}
          {/* <div className="pointer-events-none absolute -right-16 top-0 h-full w-40 bg-gradient-to-l from-white to-transparent z-10" /> */}
            
            <AnimatePresence custom={direction} mode="wait">

              <motion.div
                key={idx}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: 0.45,
                  ease: "easeInOut",
                }}
                className="rounded-3xl bg-[#C9AE63] p-10 text-white shadow-xl"
              >

                <div className="text-6xl opacity-80 leading-none">
                  “
                </div>

                <p className="mt-2 text-sm md:text-base leading-relaxed text-white/95">
                  {t.quote}
                </p>

                <div className="mt-8">

                  <p className="text-sm font-semibold">
                    {t.name}
                  </p>

                  <p className="text-xs text-white/80">
                    {t.role}
                  </p>

                  <div className="text-xs mt-1">
                    ⭐⭐⭐⭐⭐
                  </div>

                </div>

              </motion.div>

            </AnimatePresence>

            {/* DOT INDICATOR */}
            <div className="flex gap-2 mt-6 justify-center">

              {data.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > idx ? 1 : -1);
                    setIdx(i);
                  }}
                  className={`h-2 rounded-full transition-all
                  ${
                    idx === i
                      ? "w-8 bg-[#C9AE63]"
                      : "w-2 bg-neutral-300"
                  }`}
                />
              ))}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}