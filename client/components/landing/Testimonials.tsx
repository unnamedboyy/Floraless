"use client";

import { useState } from "react";

const data = [
  {
    name: "Nadira & Fajar — Wedding Event",
    quote:
      "Pengalaman kami menggunakan Floraless benar-benar luar biasa. Proses booking lewat website sangat mudah karena bisa langsung pilih tanggal di kalender dan melihat ketersediaan. Setelah mengirim detail acara, admin merespon dengan cepat dan membantu kami menyempurnakan konsep dekorasi. Hasilnya sangat elegan dan sesuai dengan tema yang kami impikan. Banyak tamu yang memuji dekorasinya, bahkan beberapa meminta kontak Floraless setelah acara selesai.",
  },
  {
    name: "Rico Pratama — Corporate Gathering",
    quote:
      "Kami menggunakan Floraless untuk acara corporate gathering kantor. Sistem booking online mereka sangat membantu karena semuanya transparan dan bisa dipantau dari dashboard. Status tiket langsung ter-update setelah disetujui admin, jadi tidak ada kebingungan. Tim dekorasi dan lighting juga profesional dan tepat waktu. Secara keseluruhan, layanan mereka sangat terorganisir dan modern.",
  },
  {
    name: "Salsa Putri — Birthday Celebration",
    quote:
      "Saya suka sekali dengan kemudahan sistemnya. Dari register akun, booking tanggal, sampai komunikasi lewat fitur chat, semuanya praktis. Awalnya saya ragu karena belum pernah menggunakan sistem online untuk booking dekorasi, tapi ternyata sangat aman dan nyaman. Tim Floraless juga fleksibel ketika saya ingin sedikit perubahan konsep beberapa hari sebelum acara. Hasil akhirnya melebihi ekspektasi saya.",
  },
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);

  const prev = () => setIdx((v) => (v - 1 + data.length) % data.length);
  const next = () => setIdx((v) => (v + 1) % data.length);

  const t = data[idx];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-10 md:grid-cols-12 md:items-center">
          
          {/* Left Side */}
          <div className="md:col-span-4">
            <h2 className="text-3xl font-semibold leading-tight">
              Dari Mereka <br /> Untuk Floraless
            </h2>

            <p className="mt-4 text-sm text-neutral-600 leading-relaxed">
              Kepuasan klien adalah prioritas utama kami. Berikut pengalaman
              nyata dari mereka yang telah mempercayakan momen spesialnya
              bersama Floraless.
            </p>

            <div className="mt-8 flex gap-3">
              <button
                onClick={prev}
                className="h-10 w-10 rounded-full border border-neutral-300 text-sm hover:bg-neutral-50 transition"
                aria-label="Prev"
              >
                ‹
              </button>
              <button
                onClick={next}
                className="h-10 w-10 rounded-full border border-neutral-300 text-sm hover:bg-neutral-50 transition"
                aria-label="Next"
              >
                ›
              </button>
            </div>
          </div>

          {/* Right Side */}
          <div className="md:col-span-8">
            <div className="rounded-3xl bg-[#C9AE63] p-10 text-white shadow-lg">
              <div className="text-6xl leading-none opacity-80">“</div>

              <p className="mt-4 text-sm md:text-base leading-relaxed text-white/95">
                {t.quote}
              </p>

              <p className="mt-8 text-xs md:text-sm font-semibold tracking-widest text-white/90 uppercase">
                — {t.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}