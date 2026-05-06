"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function KontakPage() {

  const [offset, setOffset] = useState(0);

  useEffect(() => {

    const onScroll = () => {
      setOffset(window.scrollY);
    };

    window.addEventListener("scroll", onScroll);

    return () =>
      window.removeEventListener("scroll", onScroll);

  }, []);

  return (
    <main className="bg-white overflow-hidden">

      {/* ======================================================
          HERO
      ====================================================== */}
      <section className="relative h-[520px] overflow-hidden">

        {/* PARALLAX IMAGE */}
        <div
          className="absolute inset-0 scale-110"
          style={{
            transform: `translateY(${offset * 0.25}px)`
          }}
        >
          <Image
            src="/about.jpg"
            alt="Kontak Floraless"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/50" />

        {/* CONTENT */}
        <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">

          <div>

            <p className="
              mb-5
              text-sm
              tracking-[0.35em]
              text-[#D4B36A]
              font-medium
            ">
              CONTACT US
            </p>

            <h1 className="
              text-5xl
              md:text-7xl
              font-semibold
              tracking-tight
              text-white
            ">
              Hubungi Kami
            </h1>

            <div className="
              mt-6
              flex
              items-center
              justify-center
              gap-3
              text-sm
              text-white/80
            ">
              <Link
                href="/"
                className="hover:text-white transition"
              >
                Home
              </Link>

              <span>/</span>

              <span>Kontak</span>

            </div>

          </div>

        </div>

      </section>

      {/* ======================================================
          CONTACT CONTENT
      ====================================================== */}
      <section className="relative py-24">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-20 lg:grid-cols-12">

            {/* ======================================================
                LEFT
            ====================================================== */}
            <div className="lg:col-span-7">

              <div className="max-w-2xl">

                <p className="
                  text-sm
                  tracking-[0.3em]
                  text-[#C9AE63]
                  font-medium
                ">
                  GET IN TOUCH
                </p>

                <h2 className="
                  mt-5
                  text-4xl
                  md:text-6xl
                  font-semibold
                  leading-tight
                  tracking-tight
                  text-black
                ">
                  Mari Diskusikan
                  <br />
                  Acara Impian Anda
                </h2>

                <p className="
                  mt-8
                  text-lg
                  leading-relaxed
                  text-neutral-600
                ">
                  Tim Floraless siap membantu Anda merancang dekorasi
                  dan pengalaman acara yang elegan, hangat,
                  dan berkesan.
                </p>

              </div>

              {/* FORM */}
              <div className="
                mt-14
                rounded-[36px]
                border
                border-[#EFE7DA]
                bg-[#FAF7F2]
                p-8
                md:p-12
              ">

                <div className="grid gap-6 md:grid-cols-2">

                  {/* NAMA */}
                  <div className="space-y-3">

                    <label className="
                      text-sm
                      font-medium
                      text-neutral-700
                    ">
                      Nama Lengkap
                    </label>

                    <input
                      type="text"
                      placeholder="Masukkan nama Anda"
                      className="
                        w-full
                        rounded-2xl
                        border
                        border-neutral-200
                        bg-white
                        px-5
                        py-4
                        text-sm
                        outline-none
                        transition
                        focus:border-[#C9AE63]
                        focus:ring-2
                        focus:ring-[#C9AE63]/20
                      "
                    />

                  </div>

                  {/* TELEPON */}
                  <div className="space-y-3">

                    <label className="
                      text-sm
                      font-medium
                      text-neutral-700
                    ">
                      Nomor Telepon
                    </label>

                    <input
                      type="text"
                      placeholder="+62 812 xxxx xxxx"
                      className="
                        w-full
                        rounded-2xl
                        border
                        border-neutral-200
                        bg-white
                        px-5
                        py-4
                        text-sm
                        outline-none
                        transition
                        focus:border-[#C9AE63]
                        focus:ring-2
                        focus:ring-[#C9AE63]/20
                      "
                    />

                  </div>

                </div>

                {/* EMAIL */}
                <div className="mt-6 space-y-3">

                  <label className="
                    text-sm
                    font-medium
                    text-neutral-700
                  ">
                    Email
                  </label>

                  <input
                    type="email"
                    placeholder="nama@email.com"
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-neutral-200
                      bg-white
                      px-5
                      py-4
                      text-sm
                      outline-none
                      transition
                      focus:border-[#C9AE63]
                      focus:ring-2
                      focus:ring-[#C9AE63]/20
                    "
                  />

                </div>

                {/* MESSAGE */}
                <div className="mt-6 space-y-3">

                  <label className="
                    text-sm
                    font-medium
                    text-neutral-700
                  ">
                    Pesan
                  </label>

                  <textarea
                    rows={6}
                    placeholder="Ceritakan kebutuhan acara Anda..."
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-neutral-200
                      bg-white
                      px-5
                      py-4
                      text-sm
                      outline-none
                      resize-none
                      transition
                      focus:border-[#C9AE63]
                      focus:ring-2
                      focus:ring-[#C9AE63]/20
                    "
                  />

                </div>

                {/* BUTTON */}
                <div className="mt-8">

                  <button
                    className="
                      rounded-full
                      bg-black
                      px-8
                      py-4
                      text-sm
                      font-medium
                      text-white
                      transition
                      hover:bg-neutral-800
                    "
                  >
                    Kirim Pesan
                  </button>

                </div>

              </div>

            </div>

            {/* ======================================================
                RIGHT
            ====================================================== */}
            <div className="lg:col-span-5">

              <div className="sticky top-32">

                <p className="
                  text-sm
                  tracking-[0.3em]
                  text-[#C9AE63]
                  font-medium
                ">
                  CONTACT INFO
                </p>

                <h3 className="
                  mt-5
                  text-3xl
                  md:text-5xl
                  font-semibold
                  leading-tight
                  tracking-tight
                  text-black
                ">
                  Kami siap membantu
                  setiap kebutuhan acara Anda.
                </h3>

                {/* INFO */}
                <div className="mt-12 space-y-10">

                  {/* ADDRESS */}
                  <div>

                    <p className="
                      text-xs
                      tracking-[0.2em]
                      text-neutral-400
                    ">
                      OFFICE
                    </p>

                    <h4 className="
                      mt-3
                      text-xl
                      font-semibold
                    ">
                      Yogyakarta, Indonesia
                    </h4>

                    <p className="
                      mt-3
                      leading-relaxed
                      text-neutral-600
                    ">
                      Floraless Decoration Studio
                      <br />
                      Babarsari, Sleman
                    </p>

                  </div>

                  {/* PHONE */}
                  <div>

                    <p className="
                      text-xs
                      tracking-[0.2em]
                      text-neutral-400
                    ">
                      WHATSAPP
                    </p>

                    <h4 className="
                      mt-3
                      text-xl
                      font-semibold
                      text-[#D4B36A]
                    ">
                      +62 812-3456-7890
                    </h4>

                  </div>

                  {/* EMAIL */}
                  <div>

                    <p className="
                      text-xs
                      tracking-[0.2em]
                      text-neutral-400
                    ">
                      EMAIL
                    </p>

                    <h4 className="
                      mt-3
                      text-xl
                      font-semibold
                      text-[#D4B36A]
                    ">
                      support@floraless.com
                    </h4>

                  </div>

                  {/* HOURS */}
                  <div>

                    <p className="
                      text-xs
                      tracking-[0.2em]
                      text-neutral-400
                    ">
                      OPEN HOURS
                    </p>

                    <h4 className="
                      mt-3
                      text-xl
                      font-semibold
                      text-[#D4B36A]
                    ">
                      Senin — Sabtu
                    </h4>

                    <p className="
                      mt-3
                      text-neutral-600
                    ">
                      09:00 — 20:00
                    </p>

                  </div>

                </div>

                {/* WHATSAPP BUTTON */}
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  className="
                    mt-14
                    inline-flex
                    items-center
                    justify-center
                    rounded-full
                    bg-[#25D366]
                    px-8
                    py-4
                    text-sm
                    font-medium
                    text-black
                    transition
                    hover:scale-[1.02]
                  "
                >
                  Chat via WhatsApp
                </a>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ======================================================
          CTA
      ====================================================== */}
      <section className="pb-24">

        <div className="mx-auto max-w-7xl px-6">

          <div className="
            relative
            overflow-hidden
            rounded-[40px]
          ">

            {/* IMAGE */}
            <div className="relative h-[420px]">

              <Image
                src="/hero.jpg"
                alt="CTA Floraless"
                fill
                className="object-cover"
              />

              <div className="absolute inset-0 bg-black/55" />

            </div>

            {/* CONTENT */}
            <div className="
              absolute
              inset-0
              flex
              items-center
              justify-center
              text-center
              px-6
            ">

              <div className="max-w-4xl">

                <p className="
                  text-sm
                  tracking-[0.35em]
                  text-[#D4B36A]
                ">
                  FLORALESS
                </p>

                <h2 className="
                  mt-6
                  text-4xl
                  md:text-6xl
                  font-semibold
                  leading-tight
                  tracking-tight
                  text-white
                ">
                  Wujudkan Acara
                  Yang Elegan dan
                  Tak Terlupakan
                </h2>

                <p className="
                  mt-8
                  text-lg
                  leading-relaxed
                  text-white/75
                ">
                  Konsultasikan konsep acara Anda bersama tim Floraless
                  dan ciptakan pengalaman dekorasi yang premium.
                </p>

                <div className="
                  mt-10
                  flex
                  flex-wrap
                  items-center
                  justify-center
                  gap-4
                ">

                  <Link
                    href="/booking"
                    className="
                      rounded-full
                      bg-white
                      px-8
                      py-4
                      text-sm
                      font-medium
                      text-black
                      transition
                      hover:bg-neutral-200
                    "
                  >
                    Booking Sekarang
                  </Link>

                  <Link
                    href="/galeri"
                    className="
                      rounded-full
                      border
                      border-white/30
                      bg-white/10
                      px-8
                      py-4
                      text-sm
                      font-medium
                      text-white
                      backdrop-blur
                      transition
                      hover:bg-white/20
                    "
                  >
                    Lihat Galeri
                  </Link>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}