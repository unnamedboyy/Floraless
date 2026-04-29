"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import Reveal from "@/components/ui/Reveal";

export default function LayananPage() {

  const [offset, setOffset] = useState(0);
  const [layanans, setLayanans] = useState<any[]>([]);

  useEffect(() => {

    const handleScroll = () => {
      setOffset(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    async function load() {
      const data = await apiFetch("/layanan");
      setLayanans(data);
    }

    load();

    return () => window.removeEventListener("scroll", handleScroll);

  }, []);

  return (
    <div className="bg-white text-neutral-900">

      {/* HERO */}
      {/* <section className="relative h-[460px] w-full overflow-hidden">

        <div
          className="absolute inset-0 scale-110"
          style={{
            transform: `translateY(${offset * 0.25}px)`
          }}
        >
          <Image
            src="/hero.jpg"
            alt="Layanan Floraless"
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative flex h-full items-center justify-center text-center px-6">

          <div className="max-w-3xl">

            <h1 className="text-5xl md:text-6xl font-semibold text-white tracking-tight">
              Layanan Floraless
            </h1>

            <p className="mt-6 text-white/80 leading-relaxed text-lg">
              Kami menghadirkan dekorasi dan produksi acara yang elegan
              serta terorganisir untuk menciptakan pengalaman yang
              berkesan bagi setiap klien.
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
            Layanan Kami
          </h1>
        </div>

      </section>

      {/* SERVICES */}
      <main>

        {layanans.map((layanan, index) => {

          const reverse = index % 2 === 1;

          const points =
            layanan.deskripsi?.split("\n") || [];

          const img =
            layanan.gambar?.split(",")[0];

          return (

            <section
              key={layanan._id}
              className={`relative py-32 ${
                reverse
                  ? "bg-neutral-900 text-white"
                  : "bg-white text-black"
              }`}
            >

              {/* BIG BACKGROUND NUMBER */}
            <div
            className={`pointer-events-none absolute top-16 ${
                reverse
                ? "left-10 text-white/10"
                : "right-10 text-neutral-900/10"
            } text-[180px] font-semibold leading-none`}
            >
                {String(index + 1).padStart(2, "0")}
              </div>

              <Reveal>

                <div className="mx-auto grid max-w-6xl items-center gap-16 px-4 md:grid-cols-12">

                  {/* TEXT */}
                  <div
                    className={`relative md:col-span-5 ${
                      reverse ? "order-2 md:order-1" : ""
                    }`}
                  >

                    <div className="h-[2px] w-16 bg-[#C9AE63] rounded-full" />

                    <h2 className="mt-6 text-3xl md:text-4xl font-semibold">
                      {layanan.nama_layanan}
                    </h2>

                    <p className="mt-2 text-lg text-[#C9AE63]">
                      Rp {layanan.harga.toLocaleString("id-ID")}
                    </p>

                    <ul className="mt-6 space-y-3">

                      {points.map((p: string, i: number) => (

                        <li
                          key={i}
                          className="flex items-start gap-3"
                        >

                          <span className="mt-2 h-2 w-2 rounded-full bg-[#C9AE63]" />

                          <span className="opacity-80 leading-relaxed">
                            {p}
                          </span>

                        </li>

                      ))}

                    </ul>

                    <a
                      href="/kontak"
                      className="mt-8 inline-flex items-center justify-center rounded-full bg-[#C9AE63] px-8 py-3 text-sm font-semibold text-white transition duration-300 hover:shadow-xl hover:scale-[1.03]"
                    >
                      Konsultasi
                    </a>

                  </div>

                  {/* IMAGE */}
                  <div
                    className={`relative md:col-span-7 ${
                      reverse ? "order-1 md:order-2" : ""
                    }`}
                  >

                    {/* decorative frame */}
                    <div className="absolute -right-8 -top-8 h-full w-full rounded-3xl border border-neutral-300" />

                    <div className="group relative overflow-hidden rounded-3xl shadow-lg">

                      <Image
                        src={img || "/hero.jpg"}
                        alt={layanan.nama_layanan}
                        width={900}
                        height={650}
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />

                      {/* gradient overlay */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-70" />

                    </div>

                  </div>

                </div>

              </Reveal>

            </section>

          );

        })}

      </main>

    </div>
  );
}