"use client";

import Link from "next/link";
import Image from "next/image";

import {
  useMemo,
  useState,
} from "react";

import {
  usePortfolio,
} from "@/hooks/usePortfolio";

export default function GalleryPage() {

  const {
    data,
    loading,
  } = usePortfolio();

  const [offset, setOffset] = useState(0);

  const portfolios =
    data || [];

  const [search, setSearch] =
    useState("");

  const filtered =
    useMemo(() => {

      return portfolios.filter(
        (item: any) => {

          return (
            item.title
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            item.excerpt
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              )
          );
        }
      );

    }, [
      portfolios,
      search,
    ]);

  if (loading) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-black">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-white text-black">

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
              GALLERY
            </p>

            <h1 className="
              text-5xl
              md:text-7xl
              font-semibold
              tracking-tight
              text-white
            ">
              Galeri Kami
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

              <span>Gallery</span>

            </div>

          </div>

        </div>

      </section>

      {/* CONTENT */}

      <section className="px-6 pb-16 pt-32">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-12 lg:grid-cols-2">

            <div>

              <p className="text-sm tracking-[0.35em] text-[#C9AE63]">
                OUR WORKS
              </p>

              <h1 className="mt-6 text-6xl font-bold leading-none md:text-7xl">
                Cerita Suskes Kami
              </h1>

            </div>

            <div className="flex items-end">

              <p className="max-w-xl text-lg leading-[2] text-neutral-500">
                Koleksi hasil dekorasi Floraless yang menghadirkan konsep elegan,
                mewah, dan penuh detail untuk wedding, gereja,
                engagement, dan berbagai acara spesial.
              </p>

            </div>

          </div>

          {/* SEARCH */}

          <div className="mt-16">

            <input
              type="text"
              placeholder="Cari portfolio..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="
                h-16
                w-full
                rounded-[24px]
                border
                border-[#C9AE63]/40
                px-7
                text-lg
                outline-none
              "
            />

          </div>

        </div>

      </section>

      {/* GALLERY */}

      <section className="px-6 pb-24">

        <div className="mx-auto max-w-7xl">

          {filtered.length === 0 ? (

            <div className="py-32 text-center text-neutral-400">
              Belum ada portfolio tersedia.
            </div>

          ) : (

            <div className="grid gap-5 md:grid-cols-12">

              {filtered.map(
                (
                  item: any,
                  index: number
                ) => {

                  const large =
                    index % 4 === 0 ||
                    index % 4 === 3;

                  return (

                    <Link
                      key={item._id}
                      href={`/gallery/${item.slug}`}
                      className={`
                        group
                        relative
                        overflow-hidden
                        rounded-[32px]
                        ${
                          large
                            ? "md:col-span-8"
                            : "md:col-span-4"
                        }
                      `}
                    >

                      <div
                        className={`
                          relative
                          overflow-hidden
                          ${
                            large
                              ? "h-[520px]"
                              : "h-[520px]"
                          }
                        `}
                      >

                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}${item.thumbnail}`}
                          alt={item.title}
                          fill
                          unoptimized
                          className="
                            object-cover
                            transition
                            duration-700
                            group-hover:scale-110
                          "
                        />

                        {/* OVERLAY */}

                        <div className="
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-black/70
                          via-black/10
                          to-transparent
                        " />

                        {/* TEXT */}

                        <div className="
                          absolute
                          bottom-0
                          left-0
                          p-8
                          text-white
                        ">

                          <p className="text-sm tracking-[0.3em] text-[#d4b26a]">
                            FLORALESS
                          </p>

                          <h2 className="mt-3 text-4xl font-bold">
                            {item.title}
                          </h2>

                          <p className="mt-4 max-w-lg text-sm leading-[1.9] text-white/80">
                            {item.excerpt}
                          </p>

                        </div>

                      </div>

                    </Link>
                  );
                }
              )}

            </div>
          )}

        </div>

      </section>

    </div>
  );
}