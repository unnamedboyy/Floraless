"use client";

import Image from "next/image";
import Link from "next/link";

export default function LayananCard({
  layanan,
}: {
  layanan: any;
}) {

  const imageUrl =  layanan.thumbnail || "/service-default.jpg";

  return (

    <div
      className="
        group
        overflow-hidden
        rounded-[32px]
        border
        border-[#EFE7DA]
        bg-white
        transition-all
        duration-500
        hover:-translate-y-2
        hover:shadow-2xl
      "
    >

      {/* =====================================================
         IMAGE
      ===================================================== */}

      <div className="
        relative
        h-[280px]
        overflow-hidden
      ">

        <Image
          src={imageUrl}
          alt={layanan.nama}
          fill
          className="
            object-cover
            transition
            duration-700
            group-hover:scale-105
          "
        />

        {/* OVERLAY */}
        <div className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black/50
          via-black/10
          to-transparent
        " />

        {/* BADGE */}
        <div className="
          absolute
          left-6
          top-6
          rounded-full
          bg-white/90
          px-4
          py-2
          text-xs
          font-medium
          tracking-[0.2em]
          text-black
          backdrop-blur
        ">
          FLORALESS
        </div>

      </div>

      {/* =====================================================
         CONTENT
      ===================================================== */}

      <div className="p-8">

        <p
          className="
            text-xs
            uppercase
            tracking-[0.3em]
            text-[#C9AE63]
            font-medium
          "
        >
          FLORALESS SERVICE
        </p>

        <h3
          className="
            mt-4
            text-3xl
            font-semibold
            tracking-tight
            text-black
          "
        >
          {layanan.nama}
        </h3>

        <p
          className="
            mt-4
            line-clamp-4
            leading-relaxed
            text-neutral-600
          "
        >
          {
            layanan.deskripsi ||

            "Layanan dekorasi premium Floraless."
          }
        </p>

        {/* PRICE */}
        <div className="
          mt-6
          flex
          items-end
          justify-between
        ">

          <div>

            <p className="
              text-xs
              uppercase
              tracking-[0.2em]
              text-neutral-400
            ">
              Harga Mulai
            </p>

            <p className="
              mt-2
              text-2xl
              font-bold
            ">
              Rp {
                (
                  layanan.harga || 0
                ).toLocaleString("id-ID")
              }
            </p>

          </div>

          <div>

            <p
              className="
                text-xs
                uppercase
                tracking-[0.2em]
                text-neutral-400
              "
            >
              Portfolio
            </p>

            <p
              className="
                mt-2
                text-2xl
                font-semibold
              "
            >
              {
                layanan.totalPortfolio || 0
              }
            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
         FOOTER
      ===================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-4
          border-t
          px-8
          py-6
        "
      >

        <span className="
          text-sm
          text-neutral-500
        ">
          Premium Decoration
        </span>

        <Link
          href={`/layanan/${layanan._id}`}
          className="
            rounded-full
            bg-black
            px-6
            py-3
            text-sm
            font-medium
            text-white
            transition
            hover:bg-neutral-800
          "
        >
          Detail
        </Link>

      </div>

    </div>
  );
}