"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import FaqSection from "@/components/landing/FaqSection";

export default function TentangPage() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <main>

      {/* HERO */}
      {/* <section className="relative h-[420px] w-full overflow-hidden">

        <div
          className="absolute inset-0 scale-110"
          style={{
            transform: `translateY(${offset * 0.3}px)`
          }}
        >
          <Image
            src="/hero.jpg"
            alt="FAQ Floraless"
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative flex h-full items-center justify-center text-center px-6">
          <div className="max-w-3xl">

            <h1 className="text-4xl md:text-5xl font-semibold text-white">
              Tentang Floraless
            </h1>

            <p className="mt-6 text-white/80 leading-relaxed">
                         Floraless hadir untuk menghadirkan dekorasi dan produksi acara yang
            elegan, terorganisir, dan berkesan. Kami memadukan kreativitas,
            detail, serta sistem perencanaan modern untuk memastikan setiap
            momen berjalan sempurna.
            </p>

          </div>
        </div>

      </section> */}

      {/* HERO PARALLAX */}
      <section className="relative h-[520px] w-full overflow-hidden">

        <div
          className="absolute inset-0 scale-110"
          style={{
            transform: `translateY(${offset * 0.35}px)`
          }}
        >
          <Image
            src="/hero.jpg"
            alt="Contact Floraless"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <h1 className="text-5xl md:text-7xl font-semibold text-white leading-tight tracking-tight">
            Tentang Kami
          </h1>
        </div>

      </section>

        {/* VISI & MISI */}
        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="grid gap-10 md:grid-cols-2">

            <div className="rounded-3xl border border-neutral-200 p-10 shadow-sm">
              <h2 className="text-2xl font-semibold">Visi</h2>
              <p className="mt-6 text-neutral-600 leading-relaxed">
                Menjadi perusahaan dekorasi dan produksi acara terpercaya
                yang menghadirkan pengalaman seamless melalui perpaduan
                kreativitas, profesionalisme, dan teknologi.
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-200 p-10 shadow-sm">
              <h2 className="text-2xl font-semibold">Misi</h2>
              <ul className="mt-6 space-y-4 text-neutral-600 leading-relaxed">
                <li>• Memberikan konsultasi personal dan detail.</li>
                <li>• Menghadirkan konsep dekorasi yang sesuai karakter klien.</li>
                <li>• Menyediakan sistem booking yang transparan dan efisien.</li>
                <li>• Menjaga kualitas produksi serta ketepatan waktu.</li>
              </ul>
            </div>

          </div>
        </section>

        {/* TIMELINE */}
        <section className="bg-neutral-50 py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-center text-3xl font-semibold">
              Perjalanan Kami
            </h2>

            <div className="mt-16 relative">

              {/* vertical line */}
              <div className="absolute left-1/2 top-0 hidden h-full w-[2px] -translate-x-1/2 bg-[#C9AE63] md:block" />

              <div className="space-y-20">

                {/* ITEM 1 */}
                <div className="md:grid md:grid-cols-2 md:gap-12 md:items-center">
                  <div className="md:text-right">
                    <h3 className="text-xl font-semibold">Awal Perjalanan</h3>
                    <p className="mt-4 text-neutral-600 leading-relaxed">
                      Floraless bermula dari kecintaan terhadap seni dekorasi
                      dan keinginan untuk membantu orang merayakan momen penting
                      secara elegan dan bermakna.
                    </p>
                  </div>

                  <div className="hidden md:flex justify-center">
                    <div className="relative h-50 w-50 rounded-full overflow-hidden border-4 border-[#C9AE63] shadow-lg">
                      <Image
                        src="/gal-1.jpg"
                        alt="Awal Perjalanan"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* ITEM 2 */}
                <div className="md:grid md:grid-cols-2 md:gap-12 md:items-center">
                  <div className="hidden md:flex justify-center order-1">
                    <div className="relative h-50 w-50 rounded-full overflow-hidden border-4 border-[#C9AE63] shadow-lg">
                      <Image
                        src="/gal-2.jpg"
                        alt="Berkembang"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="order-2">
                    <h3 className="text-xl font-semibold">
                      Berkembang & Profesional
                    </h3>
                    <p className="mt-4 text-neutral-600 leading-relaxed">
                      Kami berkembang menjadi tim profesional yang tidak hanya
                      fokus pada estetika, tetapi juga manajemen acara yang
                      terstruktur dan efisien.
                    </p>
                  </div>
                </div>

                {/* ITEM 3 */}
                <div className="md:grid md:grid-cols-2 md:gap-12 md:items-center">
                  <div className="md:text-right">
                    <h3 className="text-xl font-semibold">
                      Integrasi Teknologi
                    </h3>
                    <p className="mt-4 text-neutral-600 leading-relaxed">
                      Kami menghadirkan sistem booking online yang memudahkan
                      klien memilih tanggal, memonitor status, dan berkomunikasi
                      secara transparan.
                    </p>
                  </div>

                  <div className="hidden md:flex justify-center">
                    <div className="relative h-50 w-50 rounded-full overflow-hidden border-4 border-[#C9AE63] shadow-lg">
                      <Image
                        src="/gal-3.jpg"
                        alt="Integrasi Teknologi"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* FOUNDER QUOTE */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <p className="text-2xl md:text-3xl font-semibold leading-relaxed text-[#C9AE63]">
              “Setiap acara adalah cerita.  
              Tugas kami adalah memastikan cerita itu dikenang dengan indah.”
            </p>

            <p className="mt-6 text-sm uppercase tracking-widest text-neutral-500">
              — Founder Floraless
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}