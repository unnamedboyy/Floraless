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
    label: "Langkah 1 – Konsultasi",
    title: "Konsultasi Awal",
    desc: "Kami memulai dengan sesi konsultasi untuk memahami konsep acara, tema dekorasi, serta kebutuhan teknis Anda. Tim Floraless akan membantu menyempurnakan ide agar sesuai dengan lokasi acara dan menciptakan suasana yang elegan.",
    image: "/process.jpg",
    ctaText: "Konsultasi Sekarang",
    ctaHref: "/kontak",
  },
  {
    key: "perencanaan",
    label: "Langkah 2 – Perencanaan Kreatif",
    title: "Perencanaan Kreatif",
    desc: "Kami menyusun perencanaan secara detail mulai dari desain dekorasi, tata letak area, pencahayaan, hingga konsep visual keseluruhan agar setiap elemen acara tampil harmonis dan berkesan.",
    image: "/gal-2.jpg",
    ctaText: "Mulai Perencanaan",
    ctaHref: "/kontak",
  },
  {
    key: "produksi",
    label: "Langkah 3 – Produksi",
    title: "Proses Produksi",
    desc: "Tim produksi kami menangani seluruh proses persiapan dan pemasangan dekorasi dengan profesional. Mulai dari instalasi dekorasi, pengaturan lighting, hingga koordinasi vendor agar semua berjalan lancar.",
    image: "/package-3.jpg",
    ctaText: "Pesan Sekarang",
    ctaHref: "/kontak",
  },
  {
    key: "hari-acara",
    label: "Langkah 4 – Hari Acara",
    title: "Hari Acara",
    desc: "Hari istimewa Anda telah tiba. Nikmati setiap momen tanpa khawatir karena tim Floraless memastikan seluruh dekorasi dan detail acara berjalan sempurna sesuai dengan rencana.",
    image: "/package-1.jpg",
    ctaText: "Hubungi Kami",
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
      <div className="mx-auto max-w-6xl px-4 py-20">

        {/* Heading */}
        <h2 className="text-center text-4xl font-semibold text-black md:text-5xl">
          Proses Perencanaan Acara Bersama Floraless
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-center text-[#C9AE63] text-base md:text-lg">
          Floraless tidak hanya menghadirkan dekorasi, tetapi juga menciptakan
          pengalaman acara yang berkesan. Dengan proses yang terstruktur,
          kami memastikan setiap tahap berjalan lancar dari perencanaan hingga
          hari pelaksanaan.
        </p>

        {/* Layout */}
        <div className="mt-14 grid gap-10 md:grid-cols-12">

          {/* LEFT SIDE STEPS */}
          <aside className="md:col-span-4 space-y-6">
            {steps.map((s) => {
              const isActive = s.key === activeKey;

              return (
                <button
                  key={s.key}
                  onClick={() => setActiveKey(s.key)}
                  className={[
                    "w-full text-left rounded-2xl px-6 py-8 transition-all shadow-md",
                    isActive
                      ? "bg-[#C9AE63] text-white"
                      : "bg-neutral-200 text-black hover:bg-neutral-300",
                  ].join(" ")}
                >
                  <h3 className="text-lg font-semibold">
                    {s.label}
                  </h3>

                  <p className="mt-3 text-sm opacity-80">
                    Klik untuk melihat detail proses.
                  </p>
                </button>
              );
            })}
          </aside>

          {/* RIGHT SIDE CONTENT */}
          <div className="md:col-span-8">

            {/* Image */}
            <div className="group relative w-full overflow-hidden rounded-3xl shadow-lg aspect-[16/7]">

              <Image
                src={active.image}
                alt={active.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                priority
              />

              <div className="pointer-events-none absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/10" />

            </div>

            {/* Title */}
            <h3 className="mt-8 text-3xl font-bold text-black md:text-4xl">
              {active.title}
            </h3>

            {/* Description */}
            <p className="mt-4 max-w-3xl text-neutral-600 leading-relaxed">
              {active.desc}
            </p>

            {/* CTA */}
            <div className="mt-8">
              <a
                href={active.ctaHref ?? "#"}
                className="inline-flex w-full items-center justify-center rounded-xl border-2 border-[#C9AE63] px-6 py-5 text-lg font-semibold text-[#C9AE63] transition hover:bg-[#C9AE63] hover:text-white"
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