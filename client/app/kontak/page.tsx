"use client";

import Image from "next/image";
import { InstagramIcon, Music2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function KontakPage() {
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
              alt="Kontak Floraless"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="absolute inset-0 bg-black/50" />

          <div className="absolute inset-0 flex items-center justify-center text-center px-6">
            <h1 className="text-5xl md:text-7xl font-semibold text-white leading-tight tracking-tight">
              Kontak Kami
            </h1>
          </div>

        </section>

        {/* CONTENT */}
        <section className="relative pb-28">
          <div className="mx-auto max-w-7xl px-6 -mt-32 grid gap-14 md:grid-cols-12">

            {/* FORM CARD */}
            <div className="md:col-span-6 h-full flex">
              <div className="rounded-3xl bg-white p-14 shadow-2xl border border-neutral-200 w-full h-full flex flex-col items-center justify-center">
                <h3 className="text-2xl font-semibold text-center">
                  Tinggalkan Pesan Anda
                </h3>
              </div>
            </div>

            {/* CONTACT INFO */}
            <div className="md:col-span-6">

              <div className="mb-10">
                <br /> <br /><br /><br /> <br />
              </div>

              <div className="mb-10">
                <h2 className="text-4xl md:text-6xl font-semibold leading-tight tracking-tight text-black">
                  Jangan ragu untuk <br className="hidden md:block" />
                  menghubungi kami
                </h2>
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-2">

                <div className="rounded-2xl bg-neutral-100 p-8 shadow-sm transition hover:shadow-md">
                  <h4 className="text-lg font-semibold">Alamat Kantor</h4>
                  <p className="mt-3 text-base text-neutral-600">
                    Yogyakarta, Indonesia
                  </p>
                </div>

                <div className="rounded-2xl bg-neutral-100 p-8 shadow-sm transition hover:shadow-md">
                  <h4 className="text-lg font-semibold">Telepon</h4>
                  <p className="mt-3 text-base text-neutral-600">
                    +62 812-3456-7890
                  </p>
                </div>

                <div className="rounded-2xl bg-neutral-100 p-8 shadow-sm transition hover:shadow-md">
                  <h4 className="text-lg font-semibold">Jam Operasional</h4>
                  <p className="mt-3 text-base text-neutral-600">
                    Setiap hari 09:00 – 19:00
                  </p>
                </div>

                <div className="rounded-2xl bg-neutral-100 p-8 shadow-sm transition hover:shadow-md">
                  <h4 className="text-lg font-semibold">Email</h4>
                  <p className="mt-3 text-base text-neutral-600">
                    hello@floraless.id
                  </p>
                </div>

              </div>

              {/* SOCIAL */}
              <div className="mt-14">
                <p className="text-sm text-neutral-500 uppercase tracking-widest">
                  Media Sosial
                </p>

                <div className="mt-6 flex gap-5">

                  <a
                    href="https://instagram.com/floraless_/"
                    target="_blank"
                    className="h-12 w-12 rounded-full border border-neutral-200 flex items-center justify-center text-[#C9AE63] transition hover:bg-[#C9AE63] hover:text-white hover:scale-105"
                  >
                    <InstagramIcon size={22} />
                  </a>

                  <a
                    href="https://www.tiktok.com/@floraless_?_r=1&_t=ZS-94Jy70HXgm4"
                    target="_blank"
                    className="h-12 w-12 rounded-full border border-neutral-200 flex items-center justify-center text-[#C9AE63] transition hover:bg-[#C9AE63] hover:text-white hover:scale-105"
                  >
                    <Music2 size={22} />
                  </a>

                </div>
              </div>

            </div>

          </div>
        </section>

      </main>
    </div>
  );
}