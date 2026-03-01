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
    label: "Step 1 – Consultation",
    title: "Consultation",
    desc: "Kami memulai dengan sesi konsultasi untuk memahami konsep acara, tema dekorasi, serta kebutuhan teknis Anda. Tim Floraless akan membantu menyempurnakan ide agar sesuai dengan lokasi.",
    image: "/process.jpg",
    ctaText: "Talk to us!",
    ctaHref: "/kontak",
  },
  {
    key: "perencanaan",
    label: "Step 2 – Creative Planning",
    title: "Creative Planning",
    desc: "Kami menyusun perencanaan detail mulai dari desain dekorasi, layout area, pencahayaan, hingga rundown produksi agar semua berjalan terstruktur dan elegan.",
    image: "/gal-2.jpg",
    ctaText: "Start Planning",
    ctaHref: "/kontak",
  },
  {
    key: "produksi",
    label: "Step 3 – Production",
    title: "Production",
    desc: "Tim produksi kami menangani pemasangan dekorasi, pengaturan lighting & sound system, serta koordinasi vendor agar seluruh elemen berjalan sempurna.",
    image: "/package-3.jpg",
    ctaText: "Book Now",
    ctaHref: "/kontak",
  },
  {
    key: "hari-acara",
    label: "Step 4 – Event Day!",
    title: "Event Day!",
    desc: "Hari istimewa Anda telah tiba. Nikmati momen tanpa khawatir karena tim Floraless memastikan setiap detail berjalan sempurna dan sesuai rencana.",
    image: "/package-1.jpg",
    ctaText: "Talk to us!",
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
          Seamless Event Planning with Floraless
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-center text-[#C9AE63] text-base md:text-lg">
          Floraless goes beyond decoration — we craft unforgettable
          experiences. Our simple steps ensure your event runs smoothly
          from concept to celebration.
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
                      ? "bg-[#C9AE63] text-black"
                      : "bg-neutral-200 text-black hover:bg-neutral-300",
                  ].join(" ")}
                >
                  <h3 className="text-lg font-semibold">
                    {s.label}
                  </h3>

                  <p className="mt-3 text-sm opacity-80">
                    Click to view details.
                  </p>
                </button>
              );
            })}
          </aside>

          {/* RIGHT SIDE CONTENT */}
          <div className="md:col-span-8">

            {/* Image */}
            <div className="relative w-full overflow-hidden rounded-3xl shadow-lg aspect-[16/7]">
              <Image
                src={active.image}
                alt={active.title}
                fill
                className="object-cover"
                priority
              />
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