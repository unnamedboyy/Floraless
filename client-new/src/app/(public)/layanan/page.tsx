"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  getAllLayanan,
} from "@/services/layanan.service";

import {
  getPortfolios,
} from "@/services/portfolio.service";

import LayananCard
from "@/components/modal/LayananCard";

export default function LayananPage() {

  const [offset, setOffset] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [layanan, setLayanan] =
    useState<any[]>([]);

  /* ============================================
     PARALLAX
  ============================================ */

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

  /* ============================================
     FETCH
  ============================================ */

  useEffect(() => {

    const fetchData =
      async () => {

        try {

          setLoading(true);

          const [
            layananRes,
            portfolioRes,
          ] = await Promise.all([

            getAllLayanan(),
            getPortfolios(),
          ]);

          const layananData =
            layananRes?.data ||
            layananRes ||
            [];

          const portfolioData =
            portfolioRes?.data ||
            portfolioRes ||
            [];

          const merged =
            layananData.map(
              (item: any) => {

                const totalPortfolio =
                  portfolioData.filter(
                    (p: any) =>
                      p?.layananIds?.some(
                        (l: any) =>
                          l._id === item._id
                      )
                  ).length;

                return {
                  ...item,
                  totalPortfolio,
                };
              }
            );

          setLayanan(merged);

        } catch (err) {

          console.error(err);

        } finally {

          setLoading(false);
        }
      };

    fetchData();

  }, []);

  /* ============================================
     FILTER
  ============================================ */

  const filtered =
    useMemo(() => {

      return layanan.filter(
        (item: any) =>
          item.nama
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    }, [layanan, search]);

  return (
    <main className="bg-white overflow-hidden">

      {/* HERO */}
      <section
        className="
          relative
          h-[520px]
          overflow-hidden
        "
      >

        <div
          className="
            absolute
            inset-0
            scale-110
          "
          style={{
            transform:
              `translateY(${offset * 0.25}px)`,
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

        <div
          className="
            absolute
            inset-0
            bg-black/60
          "
        />

        <div
          className="
            relative
            z-10
            flex
            h-full
            items-center
            justify-center
            px-6
            text-center
          "
        >

          <div>

            <p
              className="
                text-sm
                tracking-[0.35em]
                text-[#D4B36A]
              "
            >
              FLORALESS SERVICES
            </p>

            <h1
              className="
                mt-6
                text-5xl
                md:text-7xl
                font-semibold
                tracking-tight
                text-white
              "
            >
              Layanan
              <br />
              Dekorasi Premium
            </h1>

            <p
              className="
                mx-auto
                mt-8
                max-w-3xl
                text-lg
                leading-relaxed
                text-white/75
              "
            >
              Temukan berbagai layanan dekorasi
              eksklusif Floraless untuk wedding,
              engagement,
              birthday,
              corporate event,
              dan berbagai acara spesial lainnya.
            </p>

          </div>

        </div>

      </section>

      {/* CONTENT */}
      <section
        className="
          py-24
        "
      >

        <div
          className="
            mx-auto
            max-w-7xl
            px-6
          "
        >

          {/* HEADER */}
          <div
            className="
              flex
              flex-col
              gap-8
              lg:flex-row
              lg:items-end
              lg:justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  tracking-[0.3em]
                  text-[#C9AE63]
                "
              >
                OUR SERVICES
              </p>

              <h2
                className="
                  mt-5
                  text-4xl
                  md:text-6xl
                  font-semibold
                  tracking-tight
                  leading-tight
                "
              >
                Pilih Konsep
                <br />
                Acara Anda
              </h2>

            </div>

            <div
              className="
                w-full
                max-w-md
              "
            >

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Cari layanan..."
                className="
                  h-14
                  w-full
                  rounded-full
                  border
                  border-[#EFE7DA]
                  bg-[#FAF7F2]
                  px-6
                  outline-none
                "
              />

            </div>

          </div>

          {/* GRID */}
          {
            loading ? (

              <div
                className="
                  mt-16
                  text-center
                  text-neutral-500
                "
              >
                Loading...
              </div>

            ) : filtered.length === 0 ? (

              <div
                className="
                  mt-16
                  rounded-[32px]
                  border
                  bg-[#FAF7F2]
                  px-6
                  py-20
                  text-center
                "
              >

                <h3
                  className="
                    text-3xl
                    font-semibold
                  "
                >
                  Layanan Tidak Ditemukan
                </h3>

                <p
                  className="
                    mt-4
                    text-neutral-500
                  "
                >
                  Coba gunakan keyword lain.
                </p>

              </div>

            ) : (

              <div
                className="
                  mt-16
                  grid
                  gap-8
                  md:grid-cols-2
                  xl:grid-cols-3
                "
              >

                {
                  filtered.map(
                    (item: any) => (

                      <LayananCard
                        key={item._id}
                        layanan={item}
                      />
                    )
                  )
                }

              </div>
            )
          }

        </div>

      </section>

      {/* CTA */}
      <section
        className="
          pb-24
        "
      >

        <div
          className="
            mx-auto
            max-w-7xl
            px-6
          "
        >

          <div
            className="
              overflow-hidden
              rounded-[40px]
              bg-black
              px-8
              py-20
              text-center
              md:px-16
            "
          >

            <p
              className="
                text-sm
                tracking-[0.35em]
                text-[#D4B36A]
              "
            >
              FLORALESS BOOKING
            </p>

            <h2
              className="
                mt-6
                text-4xl
                md:text-6xl
                font-semibold
                leading-tight
                tracking-tight
                text-white
              "
            >
              Siap Membuat
              Acara Impian?
            </h2>

            <p
              className="
                mx-auto
                mt-8
                max-w-3xl
                text-lg
                leading-relaxed
                text-white/70
              "
            >
              Konsultasikan kebutuhan dekorasi
              acara Anda bersama tim Floraless.
            </p>

            <Link
              href="/booking"
              className="
                mt-10
                inline-flex
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

          </div>

        </div>

      </section>

    </main>
  );
}
