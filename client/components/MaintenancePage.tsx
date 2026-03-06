"use client";

import { motion } from "framer-motion";
import { Wrench, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MaintenancePage() {

  const launchDate = new Date();
  launchDate.setHours(launchDate.getHours() + 6);

  const [time, setTime] = useState<number>(
    launchDate.getTime() - Date.now()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(launchDate.getTime() - Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hours = Math.max(0, Math.floor(time / (1000 * 60 * 60)));
  const minutes = Math.max(
    0,
    Math.floor((time % (1000 * 60 * 60)) / (1000 * 60))
  );
  const seconds = Math.max(0, Math.floor((time % (1000 * 60)) / 1000));

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black text-white">

      {/* GRADIENT BG */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-neutral-900" />

      {/* GLOW */}
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#C9AE63]/20 blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#C9AE63]/20 blur-[120px]" />

      {/* PARTICLES */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(20)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-10, 10],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-xl px-6 text-center">

        {/* ICON */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[#C9AE63]/20 backdrop-blur"
        >
          <Wrench size={34} className="text-[#C9AE63]" />
        </motion.div>

        {/* TITLE */}
        <h1 className="text-4xl font-semibold md:text-5xl">
          Website Sedang Maintenance
          <span className="block text-[#C9AE63]">
            Dalam 
          </span>
        </h1>

        {/* TEXT */}
        <p className="mt-6 text-sm text-neutral-400 leading-relaxed">
          Kami sedang melakukan peningkatan sistem untuk memberikan pengalaman
          terbaik bagi Anda. Website akan segera kembali online.
        </p>

        {/* COUNTDOWN */}
        <div className="mt-10 flex justify-center gap-6">

          <TimeBox value={hours} label="Jam" />
          <TimeBox value={minutes} label="Menit" />
          <TimeBox value={seconds} label="Detik" />

        </div>

        {/* PROGRESS BAR */}
        <div className="mt-10">

          <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">

            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "70%" }}
              transition={{ duration: 3 }}
              className="h-full bg-[#C9AE63]"
            />

          </div>

          <p className="mt-3 text-xs text-neutral-500">
            System upgrade in progress...
          </p>

        </div>

        {/* BUTTON */}
        <div className="mt-10">

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#C9AE63] px-6 py-3 text-sm font-semibold text-black hover:opacity-90 transition"
          >
            Kembali ke Beranda
          </Link>

        </div>

      </div>

    </div>
  );
}


function TimeBox({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="w-20 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 backdrop-blur">
      <p className="text-xl font-semibold">{value}</p>
      <p className="text-xs text-neutral-500">{label}</p>
    </div>
  );
}