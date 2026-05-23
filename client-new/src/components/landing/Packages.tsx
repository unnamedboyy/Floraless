"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";

type Layanan = {
  _id: string;
  nama?: string;
  nama_layanan?: string;
  deskripsi?: string;
  gambar?: string;
  harga?: number;
};

export default function Packages() {

  const [layananList, setLayananList] =
    useState<Layanan[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const loadLayanan = async () => {

      try {

        const res = await api.get(
          "/layanans"
        );

        console.log(
          "LAYANAN:",
          res.data
        );

        setLayananList(
          res.data?.data ||
          res.data ||
          []
        );

      } catch (err) {

        console.error(
          "Gagal load layanan:",
          err
        );

      } finally {

        setLoading(false);

      }

    };

    loadLayanan();

  }, []);

  return (
    <section
      id="packages"
      className="
        bg-[#0C0908]
        py-24
        text-white
      "
    >

      <div className="mx-auto max-w-7xl px-6">

        {/* ================= HEADER ================= */}

        <div className="grid gap-10 md:grid-cols-12 items-start">

          <div className="md:col-span-6">

            <p
              className="
                text-sm
                tracking-[0.3em]
                text-[#D4B36A]
              "
            >
              PACKAGES
            </p>

            <h2
              className="
                mt-5
                text-4xl
                font-bold
                leading-tight
                md:text-5xl
              "
            >
              Pilih Paket Dekorasi
              <br />
              Sesuai Kebutuhan
            </h2>

          </div>

          <div className="md:col-span-6">

            <p
              className="
                text-base
                leading-relaxed
                text-white/70
              "
            >
              Kami menyediakan berbagai pilihan
              layanan dekorasi gereja dan event
              yang dapat disesuaikan dengan
              kebutuhan dan konsep acara Anda.
            </p>

          </div>

        </div>

        {/* ================= LOADING ================= */}

        {loading && (

          <div
            className="
              mt-16
              text-center
              text-white/50
            "
          >
            Loading packages...
          </div>

        )}

        {/* ================= GRID ================= */}

        {!loading && (

          <div
            className="
              mt-16
              grid
              gap-8
              md:grid-cols-2
              xl:grid-cols-3
            "
          >

            {layananList.map((layanan) => {

              const points =
                layanan.deskripsi?.split("\n") || [];

              return (

                <div
                  key={layanan._id}
                  className="
                    group
                    overflow-hidden
                    rounded-[32px]
                    border
                    border-white/10
                    bg-white/5
                    backdrop-blur-xl
                    transition-all
                    duration-500
                    hover:-translate-y-2
                    hover:border-[#C9AE63]/40
                  "
                >

                  {/* IMAGE */}
                  <div
                    className="
                      relative
                      h-[520px]
                      overflow-hidden
                    "
                  >

                    <Image
                      src={
                        layanan.gambar ||
                        "/package-1.jpg"
                      }
                      alt={
                        layanan.nama ||
                        layanan.nama_layanan ||
                        "package"
                      }
                      fill
                      className="
                        object-cover
                        transition-transform
                        duration-700
                        group-hover:scale-110
                      "
                    />

                    {/* OVERLAY */}
                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black
                        via-black/50
                        to-transparent
                      "
                    />

                    {/* CONTENT */}
                    <div
                      className="
                        absolute
                        inset-0
                        flex
                        flex-col
                        justify-end
                        p-7
                        text-white
                      "
                    >

                      <h3
                        className="
                          text-2xl
                          font-bold
                        "
                      >
                        {layanan.nama ||
                          layanan.nama_layanan}
                      </h3>

                      {points[0] && (

                        <p
                          className="
                            mt-3
                            text-sm
                            leading-relaxed
                            text-white/80
                          "
                        >
                          {points[0]}
                        </p>

                      )}

                      {/* TAGS */}
                      <div
                        className="
                          mt-5
                          flex
                          flex-wrap
                          gap-2
                        "
                      >

                        {points
                          .slice(1, 5)
                          .map((p, i) => (

                          <span
                            key={i}
                            className="
                              rounded-full
                              border
                              border-white/10
                              bg-white/10
                              px-3
                              py-1
                              text-xs
                              backdrop-blur
                            "
                          >
                            {p}
                          </span>

                        ))}

                      </div>

                      {/* PRICE */}
                      {layanan.harga && (

                        <p
                          className="
                            mt-6
                            text-3xl
                            font-bold
                            text-[#C9AE63]
                          "
                        >
                          Rp{" "}
                          {layanan.harga.toLocaleString(
                            "id-ID"
                          )}
                        </p>

                      )}

                      {/* BUTTON */}
                      <a
                        href="/register"
                        className="
                          mt-7
                          inline-flex
                          items-center
                          justify-center
                          rounded-full
                          bg-white
                          px-6
                          py-3
                          text-sm
                          font-semibold
                          text-black
                          transition
                          hover:bg-neutral-200
                        "
                      >
                        Booking Sekarang
                      </a>

                    </div>

                  </div>

                </div>

              );

            })}

            {/* EMPTY */}

            {layananList.length === 0 && (

              <div
                className="
                  col-span-full
                  rounded-3xl
                  border
                  border-white/10
                  bg-white/5
                  p-10
                  text-center
                  text-white/50
                "
              >
                Belum ada paket tersedia.
              </div>

            )}

          </div>

        )}

      </div>

    </section>
  );
}