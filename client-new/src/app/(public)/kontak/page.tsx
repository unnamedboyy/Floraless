"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Mail,
  Phone,
  MapPin,
  Clock3,
  Instagram,
  Facebook,
  MessageCircle,
} from "lucide-react";

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

    <main className="
      overflow-hidden
      bg-white
    ">

      {/* =====================================================
         HERO
      ===================================================== */}

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
              GET IN TOUCH
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

      {/* =====================================================
         CONTACT INFO
      ===================================================== */}

      <section className="
        relative
        py-28
      ">

        <div className="
          mx-auto
          max-w-7xl
          px-6
        ">

          {/* INFO GRID */}
          <div className="
            grid
            gap-8
            md:grid-cols-2
            xl:grid-cols-4
          ">

            {/* LOCATION */}
            <div className="
              rounded-[32px]
              border
              border-[#EFE7DA]
              bg-[#FAF7F2]
              p-8
              transition
              hover:-translate-y-1
            ">

              <div className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-black
                text-white
              ">
                <MapPin size={28} />
              </div>

              <p className="
                mt-8
                text-xs
                uppercase
                tracking-[0.25em]
                text-neutral-400
              ">
                Office
              </p>

              <h3 className="
                mt-4
                text-2xl
                font-semibold
              ">
                Yogyakarta
              </h3>

              <p className="
                mt-4
                leading-relaxed
                text-neutral-600
              ">
                Floraless Decoration Studio
                <br />
                Babarsari, Sleman
              </p>

            </div>

            {/* PHONE */}
            <div className="
              rounded-[32px]
              border
              border-[#EFE7DA]
              bg-[#FAF7F2]
              p-8
              transition
              hover:-translate-y-1
            ">

              <div className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-black
                text-white
              ">
                <Phone size={28} />
              </div>

              <p className="
                mt-8
                text-xs
                uppercase
                tracking-[0.25em]
                text-neutral-400
              ">
                WhatsApp
              </p>

              <h3 className="
                mt-4
                text-2xl
                font-semibold
                text-[#C9AE63]
              ">
                +62 812 3456 7890
              </h3>

              <p className="
                mt-4
                text-neutral-600
              ">
                Hubungi kami untuk
                konsultasi dan booking.
              </p>

            </div>

            {/* EMAIL */}
            <div className="
              rounded-[32px]
              border
              border-[#EFE7DA]
              bg-[#FAF7F2]
              p-8
              transition
              hover:-translate-y-1
            ">

              <div className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-black
                text-white
              ">
                <Mail size={28} />
              </div>

              <p className="
                mt-8
                text-xs
                uppercase
                tracking-[0.25em]
                text-neutral-400
              ">
                Email
              </p>

              <h3 className="
                mt-4
                text-xl
                font-semibold
                text-[#C9AE63]
                break-all
              ">
                support@floraless.com
              </h3>

              <p className="
                mt-4
                text-neutral-600
              ">
                Kirim pertanyaan dan
                kebutuhan acara Anda.
              </p>

            </div>

            {/* HOURS */}
            <div className="
              rounded-[32px]
              border
              border-[#EFE7DA]
              bg-[#FAF7F2]
              p-8
              transition
              hover:-translate-y-1
            ">

              <div className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-black
                text-white
              ">
                <Clock3 size={28} />
              </div>

              <p className="
                mt-8
                text-xs
                uppercase
                tracking-[0.25em]
                text-neutral-400
              ">
                Open Hours
              </p>

              <h3 className="
                mt-4
                text-2xl
                font-semibold
              ">
                Senin — Sabtu
              </h3>

              <p className="
                mt-4
                text-neutral-600
              ">
                09:00 — 20:00 WIB
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
         CTA
      ===================================================== */}

      <section className="
        pb-24
      ">

        <div className="
          mx-auto
          max-w-7xl
          px-6
        ">

          <div className="
            relative
            overflow-hidden
            rounded-[40px]
          ">

            {/* IMAGE */}
            <div className="
              relative
              h-[420px]
            ">

              <Image
                src="/hero.jpg"
                alt="CTA Floraless"
                fill
                className="object-cover"
              />

              <div className="
                absolute
                inset-0
                bg-black/60
              " />

            </div>

            {/* CONTENT */}
            <div className="
              absolute
              inset-0
              flex
              items-center
              justify-center
              px-6
              text-center
            ">

              <div className="
                max-w-4xl
              ">

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
                  font-semibold
                  leading-tight
                  tracking-tight
                  text-white
                  md:text-6xl
                ">
                  Ciptakan Momen
                  Yang Tak Terlupakan
                </h2>

                <p className="
                  mt-8
                  text-lg
                  leading-relaxed
                  text-white/75
                ">
                  Wujudkan konsep acara
                  elegan bersama Floraless
                  Decoration Studio.
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