"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useJadwal } from "@/hooks/useJadwal";
import BookingCalendar from "@/components/jadwal/BookingCalendar";
import BookingForm from "@/components/form/BookingForm";

export default function BookingPage() {

    const today =
      new Date()
        .toISOString()
        .split("T")[0];

    const {
      data: jadwalData = [],
    } = useJadwal({
      start: today,
      end: "2099-12-31",
    });

  const [offset, setOffset] =
    useState(0);

  useEffect(() => {

    const onScroll = () => {
      setOffset(window.scrollY);
    };

    window.addEventListener(
      "scroll",
      onScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        onScroll
      );

  }, []);

  return (
    <main className="
      bg-white
      overflow-hidden
    ">

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
                  BOOKING FORM
                </p>

                <h1 className="
                  text-5xl
                  md:text-7xl
                  font-semibold
                  tracking-tight
                  text-white
                ">
                  Isi Form Pemesanan
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

                  <span>Booking</span>

                </div>

              </div>

            </div>

          </section>

          {/* ======================================================
              CALENDAR
          ====================================================== */}
          <section className="relative py-24 bg-[#FAF7F2]">

            {/* BACKGROUND ACCENT */}
            <div className="
              absolute
              inset-0
              overflow-hidden
              pointer-events-none
            ">

              <div className="
                absolute
                top-0
                left-1/2
                h-[500px]
                w-[500px]
                -translate-x-1/2
                rounded-full
                bg-[#D4B36A]/10
                blur-3xl
              " />

            </div>

            <div className="
              relative
              z-10
              mx-auto
              max-w-7xl
              px-6
            ">

              {/* SECTION HEADER */}
              <div className="
                mb-16
                text-center
              ">

                <p className="
                  text-sm
                  tracking-[0.35em]
                  text-[#C9AE63]
                  font-medium
                ">
                  EVENT AVAILABILITY
                </p>

                <h2 className="
                  mt-5
                  text-4xl
                  md:text-6xl
                  font-semibold
                  tracking-tight
                  text-black
                ">
                  Pilih Tanggal Terbaik
                </h2>

                <p className="
                  mx-auto
                  mt-6
                  max-w-3xl
                  text-base
                  leading-relaxed
                  text-neutral-600
                ">
                  Lihat ketersediaan jadwal secara realtime.
                  Tanggal yang telah memiliki acara akan
                  ditandai sebagai booked dan tidak dapat
                  dipilih untuk booking baru.
                </p>

              </div>

              {/* CALENDAR CARD */}
              <div className="
                overflow-hidden
                rounded-[40px]
                border
                border-[#EFE7DA]
                bg-white
                p-4
                md:p-8
                shadow-[0_20px_80px_rgba(0,0,0,0.05)]
              ">

                <BookingCalendar
                  data={jadwalData}
                />

              </div>

            </div>

          </section>

          {/* ======================================================
              BOOKING FORM
          ====================================================== */}

          <section
            id="booking-form"
            className="
              relative
              overflow-hidden
              py-24
              bg-white
            "
          >

            {/* DECOR */}
            <div className="
              absolute
              right-0
              top-0
              h-[400px]
              w-[400px]
              rounded-full
              bg-[#D4B36A]/5
              blur-3xl
            " />

            <div className="
              mx-auto
              max-w-6xl
              px-6
            ">

              {/* HEADER */}
              <div className="
                mb-14
                text-center
              ">

                <p className="
                  text-sm
                  tracking-[0.35em]
                  text-[#C9AE63]
                  font-medium
                ">
                  BOOKING FORM
                </p>

                <h2 className="
                  mt-5
                  text-4xl
                  md:text-6xl
                  font-semibold
                  tracking-tight
                ">
                  Mulai Konsultasi Acara
                </h2>

                <p className="
                  mx-auto
                  mt-6
                  max-w-2xl
                  text-neutral-600
                  leading-relaxed
                ">
                  Isi formulir booking untuk mulai
                  merencanakan dekorasi acara impian Anda
                  bersama Floraless.
                </p>

              </div>

              {/* FORM CARD */}
              <div className="
                relative
                overflow-hidden
                rounded-[40px]
                border
                border-[#EFE7DA]
                bg-[#FAF7F2]
                p-6
                md:p-12
                shadow-[0_20px_80px_rgba(0,0,0,0.05)]
              ">

                {/* INNER GLOW */}
                <div className="
                  absolute
                  inset-0
                  bg-gradient-to-br
                  from-[#D4B36A]/5
                  to-transparent
                  pointer-events-none
                " />

                <div className="relative z-10">

                  <BookingForm />

                </div>

              </div>

            </div>

          </section>

    </main>
  );
}