"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type Step = {
  key: string;
  label: string;
  title: string;
  desc: string;
  image: string;
  ctaText: string;
  ctaHref?: string;
};

const steps: Step[] = [
  {
    key: "konsultasi",
    label: "Step 1 – Konsultasi",
    title: "Konsultasi",
    desc: "Arahkan isi deskripsi konsultasi di sini (placeholder).",
    image: "/process.jpg",
    ctaText: "Hubungi kami!",
    ctaHref: "/kontak",
  },
  {
    key: "perencanaan",
    label: "Step 2 – Perencanaan Kreatif",
    title: "Perencanaan Kreatif",
    desc: "Arahkan isi deskripsi perencanaan kreatif di sini (placeholder).",
    image: "/process.jpg",
    ctaText: "Mulai Diskusi",
    ctaHref: "/kontak",
  },
  {
    key: "eksekusi",
    label: "Step 3 – Eksekusi",
    title: "Eksekusi",
    desc: "Arahkan isi deskripsi eksekusi di sini (placeholder).",
    image: "/process.jpg",
    ctaText: "Konsultasi Sekarang",
    ctaHref: "/kontak",
  },
  {
    key: "hari-acara",
    label: "Step 4 – Hari Acara",
    title: "Hari Acara",
    desc: "Arahkan isi deskripsi hari acara di sini (placeholder).",
    image: "/process.jpg",
    ctaText: "Hubungi kami!",
    ctaHref: "/kontak",
  },
];

export default function ProcessAndConsultation() {
  const [activeKey, setActiveKey] = useState<string>(steps[0].key);

  const active = useMemo(
    () => steps.find((s) => s.key === activeKey) ?? steps[0],
    [activeKey]
  );

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-center text-2xl font-semibold text-[#C9AE63] md:text-3xl">
          Perencanaan Dekorasi Gereja & Event <br className="hidden md:block" />
          yang Mulus Bersama Floraless
        </h2>
        <p className="mx-auto mt-3 max-w-3xl text-center text-sm text-neutral-600 md:text-base">
          Isi deskripsi pengantar section (placeholder).
        </p>

        <div className="mt-10 grid gap-10 md:grid-cols-12 md:items-start">
          {/* KIRI: tombol/step */}
          <aside className="md:col-span-4">
            <div className="space-y-5">
              {steps.map((s) => {
                const isActive = s.key === activeKey;

                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setActiveKey(s.key)}
                    className={[
                      "w-full text-left transition",
                      "rounded-none px-8 py-9 md:px-10 md:py-10",
                      "shadow-[0_8px_22px_rgba(0,0,0,0.06)]",
                      isActive
                        ? "bg-[#C9AE63] text-white"
                        : "bg-[#9A9A9A] text-white/95 hover:opacity-95",
                    ].join(" ")}
                  >
                    <div> 
                      <h2 className="text-left text-l font-semibold md:text-l">
                        {s.label}
                      </h2>
                    </div>

                    <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-white/90 md:text-m">
                      Klik untuk melihat detail.
                    </p>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* KANAN: konten berubah */}
          <div className="md:col-span-8">
            <div className="relative h-[260px] w-full overflow-hidden rounded-[28px] shadow-[0_10px_30px_rgba(0,0,0,0.10)] md:h-[380px]">
              <Image
                src={active.image}
                alt={active.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* 2) Judul + info */}
            <div className="mt-7">
              <h3 className="text-[20px] font-extrabold tracking-tight text-black md:text-[30px]">
                {active.title}
              </h3>
              <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-neutral-700 md:text-base">
                {active.desc}
              </p>
            </div>

            {/* 3) Tombol bawah: full width, border emas, rounded agak besar (lebih “About”) */}
            <div className="mt-8">
              <a
                href={active.ctaHref ?? "#"}
                className="inline-flex w-full items-center justify-center rounded-[14px] border-2 border-[#C9AE63] px-6 py-5 text-base font-semibold text-[#C9AE63] hover:bg-[#C9AE63]/10 md:text-lg"
              >
                {active.ctaText}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
