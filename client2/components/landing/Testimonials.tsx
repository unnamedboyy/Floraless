"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/api";

type Testimoni = {
  _id: string;
  komentar: string;
  rating: number;
  pelanggan?: {
    username?: string;
  };
  layanan?: {
    nama_layanan?: string;
  };
};

export default function Testimonials() {

  const [data, setData] = useState<Testimoni[]>([]);
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [pause, setPause] = useState(false);

  /* ======================
     LOAD DATA FROM API
  ====================== */

  useEffect(() => {

    async function load() {
      try {

        const res = await apiFetch("/testimoni");

        setData(res);

      } catch (err) {
        console.error(err);
      }
    }

    load();

  }, []);

  /* ======================
     AUTO SLIDE
  ====================== */

  useEffect(() => {

    if (pause || data.length === 0) return;

    const interval = setInterval(() => {
      next();
    }, 6000);

    return () => clearInterval(interval);

  }, [pause, data]);

  if (!data.length) return null;

  const next = () => {
    setDirection(1);
    setIdx((v) => (v + 1) % data.length);
  };

  const prev = () => {
    setDirection(-1);
    setIdx((v) => (v - 1 + data.length) % data.length);
  };

  const t = data[idx];

  /* ======================
     ANIMATION
  ====================== */

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

      <div className="mx-auto max-w-6xl px-4 pb-24">

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

            <AnimatePresence custom={direction} mode="wait">

              <motion.div
                key={t._id}
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
                  {t.komentar}
                </p>

                <div className="mt-8">

                  <p className="text-sm font-semibold">
                    {t.pelanggan?.username}
                  </p>

                  <p className="text-xs text-white/80">
                    {t.layanan?.nama_layanan}
                  </p>

                  <div className="text-xs mt-1">

                    {"⭐".repeat(t.rating)}

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