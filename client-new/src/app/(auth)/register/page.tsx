"use client";

import { useEffect, useState } from "react";
import RegisterForm from "@/components/form/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {

  /* =========================================================
     BG SLIDESHOW
  ========================================================= */

  const images = [
    "/auth/bg1.jpg",
    "/auth/bg2.jpg",
    "/auth/bg3.jpg",
    "/auth/bg4.jpg",
  ];

  const [bgIndex, setBgIndex] =
    useState(0);

  useEffect(() => {

    const interval = setInterval(() => {

      setBgIndex((prev) =>
        prev === images.length - 1
          ? 0
          : prev + 1
      );

    }, 5000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div
      className="
        min-h-screen
        relative
        overflow-hidden
        bg-[#160B44]
      "
    >

      {/* =====================================================
          BACKGROUND
      ===================================================== */}
      <div className="absolute inset-0">

        {images.map((img, index) => (

          <div
            key={img}
            className={`
              absolute inset-0
              bg-cover bg-center
              transition-opacity
              duration-[2000ms]
              brightness-[0.55]
              saturate-125
              ${
                index === bgIndex
                  ? "opacity-100"
                  : "opacity-0"
              }
            `}
            style={{
              backgroundImage: `url(${img})`,
            }}
          />

        ))}

        {/* DARK OVERLAY */}
        <div
          className="
            absolute inset-0
            bg-[#0f0f17]/60
          "
        />

        {/* GLOW */}
        <div
          className="
            absolute
            -top-40
            -left-32
            w-[500px]
            h-[500px]
            rounded-full
            bg-[#C9AE63]/10
            blur-3xl
          "
        />

      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <div
        className="
          relative
          z-10
          min-h-screen
          flex
          items-center
          justify-center
          px-5
          py-10
        "
      >

        <div
          className="
            w-full
            max-w-7xl
            grid
            lg:grid-cols-2
            gap-14
            items-center
          "
        >

          {/* =================================================
              LEFT CONTENT
          ================================================= */}
          <div
            className="
              hidden
              lg:flex
              flex-col
              justify-center
              min-h-[700px]
              relative
            "
          >

            <div
              className="
                relative
                z-10
                max-w-[560px]
              "
            >

              {/* BRAND */}
              <p
                className="
                  text-[#C9AE63]
                  tracking-[0.35em]
                  text-sm
                  font-semibold
                  mb-8
                "
              >
                FLORALESS
              </p>

              {/* TITLE */}
              <h1
                className="
                  text-6xl
                  font-bold
                  leading-[1.05]
                  text-white
                "
              >
                Create your
                <br />
                Floraless account
              </h1>

              {/* DESC */}
              <p
                className="
                  mt-8
                  text-xl
                  leading-relaxed
                  text-white/75
                "
              >
                Daftar sekarang dan mulai
                memesan layanan dekorasi
                profesional dengan pengalaman
                modern, elegan, dan responsif.
              </p>

              {/* BUTTONS */}
              <div className="flex gap-4 mt-10">

              <Link
                href="/"
                className="
                  inline-flex
                  items-center
                  justify-center
                  px-7
                  py-3
                  rounded-2xl
                  border
                  border-white/20
                  bg-white/10
                  text-white
                  hover:bg-white/20
                  transition
                "
              >
                Explore
              </Link>

              </div>

            </div>

          </div>

          {/* =================================================
              RIGHT FORM
          ================================================= */}
          <div
            className="
              w-full
              max-w-[520px]
              mx-auto
            "
          >

            {/* MOBILE HEADER */}
            <div
              className="
                lg:hidden
                text-center
                mb-8
              "
            >

              <p
                className="
                  text-[#C9AE63]
                  tracking-[0.35em]
                  text-sm
                  font-semibold
                "
              >
                FLORALESS
              </p>

              <h1
                className="
                  mt-5
                  text-4xl
                  font-bold
                  text-white
                "
              >
                Create Account
              </h1>

              <p
                className="
                  mt-3
                  text-white/70
                "
              >
                Buat akun pelanggan Floraless
              </p>

            </div>

            {/* GLASS FORM */}
            <div
              className="
                rounded-[36px]
                border
                border-white/10
                bg-white/10
                backdrop-blur-xl
                p-8
                md:p-10
                shadow-[0_20px_80px_rgba(0,0,0,0.45)]
              "
            >

              <RegisterForm />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}