"use client";

import Link from "next/link";
import Image from "next/image";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Search }
from "lucide-react";

import {
  getGalleryPortfolio,
  getFeaturedPortfolios,
} from "@/services/portfolio.service";

type PortfolioItem = {

  _id: string;

  title: string;

  slug: string;

  excerpt: string;

  isFeatured?: boolean;

  layananIds?: {
    _id: string;
    nama: string;
  }[];

  coverImage?: {
    url: string;
  };
};

export default function GalleryPage() {

  const [data, setData] =
    useState<PortfolioItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [offset, setOffset] =
    useState(0);

  useEffect(() => {

    const fetchData =
      async () => {

        try {

          const res =
            await getFeaturedPortfolios();

          setData(
            Array.isArray(res)
              ? res
              : []
          );

        } catch (err) {

          console.error(err);

        } finally {

          setLoading(false);
        }
      };

    fetchData();

  }, []);

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

  const filtered =
    useMemo(() => {

      return data.filter(
        (item) =>

          item.title
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    }, [data, search]);

  return (

    <div className="
      bg-white
      text-black
    ">

      {/* ================= HERO ================= */}
      <section className="relative h-[520px] overflow-hidden">

        <Image
          src="/about.jpg"
          alt="Gallery Floraless"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">

          <div>

            <p className="text-sm tracking-[0.3em] text-[#C9AE63]">
              GALLERY
            </p>

            <h1 className="
              mt-5
              text-5xl
              font-bold
              text-white
              md:text-7xl
            ">
              Koleksi Kami
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

              <Link href="/">
                Home
              </Link>

              <span>/</span>

              <span>Gallery</span>

            </div>

          </div>

        </div>

      </section>

      {/* ================= SEARCH ================= */}

      <section className="
        px-6
        py-16
      ">

        <div className="
          mx-auto
          max-w-7xl
        ">

          <div className="
            relative
            mx-auto
            max-w-3xl
          ">

            <Search
              size={20}
              className="
                absolute
                left-6
                top-1/2
                -translate-y-1/2
                text-neutral-400
              "
            />

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
                rounded-[28px]
                border
                border-[#D4B36A]/20
                bg-white
                pl-14
                pr-6
                text-lg
                outline-none
              "
            />

          </div>

        </div>

      </section>

      {/* ================= GALLERY ================= */}

      <section className="
        px-6
        pb-28
      ">

        <div className="
          mx-auto
          max-w-7xl
        ">

          {
            loading ? (

              <div className="
                py-32
                text-center
                text-neutral-400
              ">
                Loading...
              </div>

            ) : filtered.length === 0 ? (

              <div className="
                py-32
                text-center
                text-neutral-400
              ">
                Belum ada portfolio tersedia.
              </div>

            ) : (

              <div className="
                grid
                gap-5
                md:grid-cols-12
              ">

                {
                  filtered.map(
                    (
                      item,
                      index
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

                          {/* IMAGE */}

                          <div className="
                            relative
                            h-[520px]
                            overflow-hidden
                          ">

                            <Image
                              src={
                                item.coverImage?.url

                                  ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${item.coverImage.url}`

                                  : "/placeholder.jpg"
                              }
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

                            {/* CONTENT */}

                            <div className="
                              absolute
                              bottom-0
                              left-0
                              p-8
                              text-white
                            ">

                              {/* BADGES */}

                              <div className="
                                mb-4
                                flex
                                flex-wrap
                                gap-2
                              ">

                                {
                                  item.layananIds?.map(
                                    (layanan) => (

                                      <span
                                        key={layanan._id}
                                        className="
                                          rounded-full
                                          border
                                          border-white/20
                                          bg-white/10
                                          px-4
                                          py-2
                                          text-xs
                                          backdrop-blur-md
                                        "
                                      >
                                        {layanan.nama}
                                      </span>
                                    )
                                  )
                                }

                                {
                                  item.isFeatured && (

                                    <span className="
                                      rounded-full
                                      bg-[#D4B36A]
                                      px-4
                                      py-2
                                      text-xs
                                      font-semibold
                                      text-black
                                    ">
                                      FEATURED
                                    </span>
                                  )
                                }

                              </div>

                              <p className="
                                text-sm
                                tracking-[0.3em]
                                text-[#D4B36A]
                              ">
                                FLORALESS
                              </p>

                              <h2 className="
                                mt-3
                                text-4xl
                                font-bold
                              ">
                                {item.title}
                              </h2>

                              <p className="
                                mt-4
                                max-w-lg
                                text-sm
                                leading-[1.9]
                                text-white/80
                              ">
                                {item.excerpt}
                              </p>

                            </div>

                          </div>

                        </Link>
                      );
                    }
                  )
                }

              </div>

            )
          }

        </div>

      </section>

    </div>
  );
}