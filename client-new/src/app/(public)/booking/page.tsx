"use client";

import Image from "next/image";
import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import { useJadwal }
from "@/hooks/useJadwal";

import BookingCalendar
from "@/components/jadwal/BookingCalendar";

import BookingForm
from "@/components/form/BookingForm";

import { socket }
from "@/lib/socket";

export default function BookingPage() {

  /* ======================================================
     TODAY
  ====================================================== */

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  /* ======================================================
     JADWAL
  ====================================================== */

  const {

    data: jadwalData = [],

    refetch,

  } = useJadwal({

    start: today,

    end: "2099-12-31",
  });

  /* ======================================================
     PARALLAX
  ====================================================== */

  const [offset,
    setOffset] = useState(0);

  useEffect(() => {

    const onScroll = () => {

      setOffset(
        window.scrollY
      );
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

  /* ======================================================
     REALTIME JADWAL
  ====================================================== */

  useEffect(() => {

    socket.on(

      "jadwal:update",

      () => {

        console.log(
          "REALTIME JADWAL UPDATE"
        );

        refetch();
      }
    );

    return () => {

      socket.off(
        "jadwal:update"
      );
    };

  }, [refetch]);

  /* ======================================================
     RENDER
  ====================================================== */

  return (

    <main className="
      bg-white
      overflow-hidden
    ">

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="
        relative
        h-[520px]
        overflow-hidden
      ">

        {/* PARALLAX IMAGE */}

        <div
          className="
            absolute
            inset-0
            scale-110
          "
          style={{
            transform:
              `translateY(${offset * 0.25}px)`
          }}
        >

          <Image
            src="/about.jpg"
            alt="Kontak Floraless"
            fill
            priority
            className="
              object-cover
            "
          />

        </div>

        {/* OVERLAY */}

        <div className="
          absolute
          inset-0
          bg-black/50
        " />

        {/* CONTENT */}

        <div className="
          relative
          z-10

          flex
          h-full

          items-center
          justify-center

          px-6

          text-center
        ">

          <div>

            <p className="
              mb-5

              text-sm
              font-medium

              tracking-[0.35em]

              text-[#D4B36A]
            ">
              BOOKING FORM
            </p>

            <h1 className="
              text-5xl
              font-semibold
              tracking-tight
              text-white

              md:text-7xl
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
                className="
                  transition
                  hover:text-white
                "
              >
                Home
              </Link>

              <span>/</span>

              <span>
                Booking
              </span>

            </div>

          </div>

        </div>

      </section>

      {/* ======================================================
          CALENDAR
      ====================================================== */}

      <section className="
        relative
        bg-[#FAF7F2]
        py-24
      ">

        <div className="
          relative
          z-10

          mx-auto
          max-w-7xl

          px-6
        ">

          {/* CALENDAR */}
            <BookingCalendar
              data={jadwalData}
            />
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
          bg-white
          py-24
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

          {/* FORM */}

            {/* GLOW */}
            <div className="
              pointer-events-none
              absolute
              inset-0
            " />

              <BookingForm />

        </div>

      </section>

    </main>
  );
}