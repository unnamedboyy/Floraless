"use client";

import Link from "next/link";
import Image from "next/image";

import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
} from "lucide-react";

import {
  getPortfolioBySlug,
} from "@/services/portfolio.service";

type PortfolioData = {
  portfolio: {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    thumbnail: string;
    createdAt: string;
  };

  photos: {
    _id: string;
    url: string;
    caption?: string;
  }[];
};

export default function PortfolioDetailPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {

  const [data, setData] =
    useState<PortfolioData | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);
    
  const [offset, setOffset] =
    useState(0);

  useEffect(() => {

    const fetchData =
      async () => {

        try {

          const resolved =
            await params;

          const res =
            await getPortfolioBySlug(
              resolved.slug
            );

          setData(res);

        } catch (err) {

          console.error(err);

        } finally {

          setLoading(false);
        }
      };

    fetchData();

  }, [params]);

  if (loading) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-black">
        Loading...
      </div>
    );
  }

  if (!data) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-black">
        Portfolio tidak ditemukan
      </div>
    );
  }

  const {
    portfolio,
    photos,
  } = data;

  return (
    <div className="bg-white text-black">

      {/* HERO */}

{/* ================= HERO ================= */}

<section className="relative h-[520px] overflow-hidden">

  {/* PARALLAX IMAGE */}

  <div
    className="absolute inset-0 scale-110"
    style={{
      transform: `translateY(${offset * 0.25}px)`,
    }}
  >

    <Image
      src={
        portfolio.thumbnail
          ? `${process.env.NEXT_PUBLIC_API_URL}${portfolio.thumbnail}`
          : "/placeholder.jpg"
      }
      alt={portfolio.title}
      fill
      priority
      unoptimized
      className="object-cover"
    />

  </div>

  {/* OVERLAY */}

  <div className="absolute inset-0 bg-black/55" />

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
        FLORALESS PORTFOLIO
      </p>

      <h1 className="
        text-5xl
        font-semibold
        tracking-tight
        text-white
        md:text-7xl
      ">
        {portfolio.title}
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

        <Link
          href="/gallery"
          className="
            transition
            hover:text-white
          "
        >
          Gallery
        </Link>

        <span>/</span>

        <span>
          {portfolio.title}
        </span>

      </div>

    </div>

  </div>

</section>

      {/* CONTENT */}

      <section className="px-6 py-24">

        <div className="mx-auto max-w-4xl">

          <div
            className="
              prose
              prose-lg
              max-w-none
              leading-[2]
            "
            dangerouslySetInnerHTML={{
              __html:
                portfolio.content ||
                "<p>Tidak ada deskripsi.</p>",
            }}
          />

        </div>

      </section>

      {/* GALLERY */}

      {photos?.length > 0 && (

        <section className="px-6 pb-32">

          <div className="mx-auto max-w-7xl">

            <div className="
              mb-16
              flex
              items-center
              justify-between
            ">

              <div>

                <p className="text-sm tracking-[0.35em] text-[#C9AE63]">
                  GALLERY
                </p>

                <h2 className="
                  mt-4
                  text-4xl
                  font-bold
                  md:text-5xl
                ">
                  Decoration Moments
                </h2>

              </div>

            </div>

            <div className="
              columns-1
              gap-5
              space-y-5
              md:columns-2
              lg:columns-3
            ">

              {photos.map(
                (
                  img,
                  index
                ) => (

                  <div
                    key={img._id || index}
                    className="
                      group
                      relative
                      overflow-hidden
                      rounded-[28px]
                    "
                  >

                    <div className="relative min-h-[300px]">

                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}${img.url}`}
                        alt={
                          img.caption ||
                          portfolio.title
                        }
                        width={1000}
                        height={1400}
                        unoptimized
                        className="
                          h-auto
                          w-full
                          object-cover
                          transition
                          duration-700
                          group-hover:scale-105
                        "
                      />

                    </div>

                    {img.caption && (

                      <div className="
                        absolute
                        inset-x-0
                        bottom-0
                        bg-gradient-to-t
                        from-black/80
                        to-transparent
                        p-6
                        text-white
                      ">

                        <p className="text-sm leading-relaxed text-white/90">
                          {img.caption}
                        </p>

                      </div>

                    )}

                  </div>
                )
              )}

            </div>

          </div>

        </section>

      )}

    </div>
  );
}