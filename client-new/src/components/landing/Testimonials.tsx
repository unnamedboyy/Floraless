"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import api from "@/lib/axios";

type Testimoni = {
  _id: string;
  komentar: string;
  rating: number;

  pelangganId?: {
    nama?: string;
    username?: string;
  };

  layananId?: {
    nama?: string;
    nama_layanan?: string;
  };
};

export default function Testimonials() {

  const [data, setData] =
    useState<Testimoni[]>([]);

  const [idx, setIdx] =
    useState(0);

  const [direction, setDirection] =
    useState(1);

  const [pause, setPause] =
    useState(false);

  /* ================= LOAD ================= */

  useEffect(() => {

    async function load() {

      try {

        const res = await api.get(
          "/testimoni"
        );

        console.log(
          "TESTIMONI:",
          res.data
        );

        setData(
          res.data?.data ||
          res.data ||
          []
        );

      } catch (err) {

        console.error(err);

      }

    }

    load();

  }, []);

  /* ================= AUTO SLIDE ================= */

  useEffect(() => {

    if (
      pause ||
      data.length === 0
    ) return;

    const interval = setInterval(() => {

      next();

    }, 6000);

    return () =>
      clearInterval(interval);

  }, [pause, data]);

  if (!data.length) return null;

  const next = () => {

    setDirection(1);

    setIdx(
      (v) => (v + 1) % data.length
    );

  };

  const prev = () => {

    setDirection(-1);

    setIdx(
      (v) =>
        (v - 1 + data.length) %
        data.length
    );

  };

  const t = data[idx];

  /* ================= ANIMATION ================= */

  const variants = {
    enter: (direction: number) => ({
      x:
        direction > 0
          ? 120
          : -120,
      opacity: 0,
    }),

    center: {
      x: 0,
      opacity: 1,
    },

    exit: (direction: number) => ({
      x:
        direction > 0
          ? -120
          : 120,
      opacity: 0,
    }),
  };

  return (
    <section
      className="
        bg-[#111827]
        py-24
        text-white
      "
    >

      <div className="mx-auto max-w-6xl px-6">

        <div className="grid gap-14 md:grid-cols-12 items-center">

          {/* LEFT */}

          <div className="md:col-span-4">

            <p
              className="
                text-sm
                tracking-[0.3em]
                text-cyan-200
              "
            >
              TESTIMONIALS
            </p>

            <h2
              className="
                mt-5
                text-4xl
                font-bold
                leading-tight
              "
            >
              Dari Mereka
              <br />
              Untuk Floraless
            </h2>

            <p
              className="
                mt-6
                text-sm
                leading-relaxed
                text-white/70
              "
            >
              Kepuasan klien adalah prioritas
              utama kami. Berikut pengalaman
              nyata dari mereka yang telah
              mempercayakan momen spesialnya
              bersama Floraless.
            </p>

            <div className="mt-8 flex gap-3">

              <button
                onClick={prev}
                className="
                  h-11
                  w-11
                  rounded-full
                  border
                  border-white/10
                  bg-white/5
                  hover:bg-white/10
                "
              >
                ‹
              </button>

              <button
                onClick={next}
                className="
                  h-11
                  w-11
                  rounded-full
                  border
                  border-white/10
                  bg-white/5
                  hover:bg-white/10
                "
              >
                ›
              </button>

            </div>

          </div>

          {/* RIGHT */}

          <div
            className="
              relative
              overflow-hidden
              md:col-span-8
            "
            onMouseEnter={() =>
              setPause(true)
            }
            onMouseLeave={() =>
              setPause(false)
            }
          >

            <AnimatePresence
              custom={direction}
              mode="wait"
            >

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
                className="
                  rounded-[36px]
                  border
                  border-white/10
                  bg-[#C9AE63]
                  p-10
                  shadow-2xl
                "
              >

                <div
                  className="
                    text-6xl
                    leading-none
                    opacity-80
                  "
                >
                  “
                </div>

                <p
                  className="
                    mt-3
                    text-base
                    leading-relaxed
                    text-white/95
                    md:text-lg
                  "
                >
                  {t.komentar}
                </p>

                <div className="mt-10">

                  <p className="font-semibold">

                    {t.pelangganId?.nama ||
                      t.pelangganId?.username}

                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-white/80
                    "
                  >
                    {t.layananId?.nama ||
                      t.layananId?.nama_layanan}
                  </p>

                  <div className="mt-2 text-sm">

                    {"⭐".repeat(
                      t.rating
                    )}

                  </div>

                </div>

              </motion.div>

            </AnimatePresence>

            {/* DOT */}

            <div className="mt-6 flex justify-center gap-2">

              {data.map((_, i) => (

                <button
                  key={i}
                  onClick={() => {

                    setDirection(
                      i > idx
                        ? 1
                        : -1
                    );

                    setIdx(i);

                  }}
                  className={`
                    h-2
                    rounded-full
                    transition-all
                    ${
                      idx === i
                        ? "w-8 bg-[#C9AE63]"
                        : "w-2 bg-white/20"
                    }
                  `}
                />

              ))}

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}