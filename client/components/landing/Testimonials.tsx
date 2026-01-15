"use client";

import { useState } from "react";

const data = [
  { name: "Client A", quote: "Lorem ipsum dolor sit amet consectetur. Gravida arcu sed sit. Pellentesque habitant morbi." },
  { name: "Client B", quote: "Lorem ipsum dolor sit amet consectetur. Nulla facilisi. Bibendum egestas non arcu." },
  { name: "Client C", quote: "Lorem ipsum dolor sit amet consectetur. Vitae dui fermentum. Orci ac auctor augue." },
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);

  const prev = () => setIdx((v) => (v - 1 + data.length) % data.length);
  const next = () => setIdx((v) => (v + 1) % data.length);

  const t = data[idx];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-8 md:grid-cols-12 md:items-center">
          <div className="md:col-span-4">
            <h2 className="text-2xl font-semibold">
              Dari Mereka <br /> Untuk Floraless
            </h2>
            <p className="mt-3 text-sm text-neutral-600">
              Lorem ipsum dolor sit amet consectetur. Amet sed nulla.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={prev}
                className="h-10 w-10 rounded-full border border-neutral-300 text-sm hover:bg-neutral-50"
                aria-label="Prev"
              >
                ‹
              </button>
              <button
                onClick={next}
                className="h-10 w-10 rounded-full border border-neutral-300 text-sm hover:bg-neutral-50"
                aria-label="Next"
              >
                ›
              </button>
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="rounded-2xl bg-[#C9AE63] p-8 text-white">
              <div className="text-5xl leading-none">“</div>
              <p className="mt-3 text-sm leading-relaxed text-white/95">{t.quote}</p>
              <p className="mt-6 text-xs font-semibold tracking-widest text-white/90">
                — {t.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
