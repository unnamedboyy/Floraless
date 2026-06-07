"use client";

import Link from "next/link";
import Image from "next/image";

import {
  useEffect,
  useState,
} from "react";

import {
  getFeaturedPortfolios,
} from "@/services/portfolio.service";

type Item = {
  _id: string;

  title: string;

  slug: string;

  excerpt: string;

  layananIds?: {
    _id: string;
    nama: string;
  }[];

  coverImage?: {
    url: string;
  };
};

export default function FeaturedPortfolio() {

  const [data, setData] =
    useState<Item[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchData =
      async () => {

        try {

          const res =
            await getFeaturedPortfolios();

          setData(res || []);

        } catch (err) {

          console.error(err);

        } finally {

          setLoading(false);
        }
      };

    fetchData();

  }, []);

  if (loading || data.length === 0) {
    return null;
  }

  return (

    <section className="
      bg-[#faf7f2]
      px-6
      py-28
    ">

      <div className="
        mx-auto
        max-w-7xl
      ">

        <div className="
          mb-16
          text-center
        ">

          <p className="
            text-sm
            tracking-[0.35em]
            text-[#D4B36A]
          ">
            FEATURED PORTFOLIO
          </p>

          <h2 className="
            mt-5
            text-5xl
            font-bold
            tracking-tight
          ">
            Inspirasi Dekorasi
          </h2>

          <p className="
            mx-auto
            mt-6
            max-w-2xl
            text-lg
            leading-[2]
            text-neutral-500
          ">
            Portfolio dekorasi terbaik
            Floraless untuk berbagai
            acara spesial dan mewah.
          </p>

        </div>

        <div className="
          grid
          gap-6
          md:grid-cols-2
        ">

          {
            data.map((item) => (

              <Link
                key={item._id}
                href={`/gallery/${item.slug}`}
                className="
                  group
                  overflow-hidden
                  rounded-[32px]
                  bg-white
                  shadow-sm
                "
              >

                <div className="
                  relative
                  h-[420px]
                  overflow-hidden
                ">

                  <Image
                    src={
                      item.coverImage?.url

                        ? `${process.env.NEXT_PUBLIC_API_URL}${item.coverImage.url}`

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

                  <div className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/80
                    via-black/10
                    to-transparent
                  " />

                  <div className="
                    absolute
                    left-6
                    top-6
                    rounded-full
                    bg-[#D4B36A]
                    px-4
                    py-2
                    text-xs
                    font-semibold
                    tracking-[0.2em]
                    text-black
                  ">
                    FEATURED
                  </div>

                  <div className="
                    absolute
                    bottom-0
                    left-0
                    p-8
                    text-white
                  ">

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

                    </div>

                    <h3 className="
                      text-4xl
                      font-bold
                    ">
                      {item.title}
                    </h3>

                    <p className="
                      mt-4
                      max-w-xl
                      text-sm
                      leading-[2]
                      text-white/80
                    ">
                      {item.excerpt}
                    </p>

                  </div>

                </div>

              </Link>
            ))
          }

        </div>

      </div>

    </section>
  );
}