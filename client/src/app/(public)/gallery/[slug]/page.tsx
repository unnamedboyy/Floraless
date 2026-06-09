"use client";

import Link from "next/link";
import Image from "next/image";

import {
  useEffect,
  useState,
} from "react";

import {
  getPortfolioBySlug,
  getRelatedPortfolio,
} from "@/services/portfolio.service";

import Lightbox from
  "yet-another-react-lightbox";

import Zoom from
  "yet-another-react-lightbox/plugins/zoom";

import Thumbnails from
  "yet-another-react-lightbox/plugins/thumbnails";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

type RelatedItem = {
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

type PortfolioData = {

  portfolio: {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    createdAt: string;
    review?: string;
    rating?: number;
    layananIds?: {
      _id: string;
      nama: string;
    }[];
  };

  photos: {
    _id: string;
    url: string;
    caption?: string;
    isCover?: boolean;

  }[];

  coverImage?: {
    url: string;
  };
  
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

  const [related,
    setRelated] =
    useState<RelatedItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [offset, setOffset] =
    useState(0);

  const [openLightbox,
    setOpenLightbox] =
    useState(false);

  const [currentIndex,
    setCurrentIndex] =
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

          if (
            res?.portfolio?._id
          ) {

            const relatedRes =
              await getRelatedPortfolio(
                res.portfolio._id
              );

            setRelated(
              relatedRes || []
            );
          }

        } catch (err) {

          console.error(err);

        } finally {

          setLoading(false);
        }
      };

    fetchData();

  }, [params]);

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

  if (loading) {

    return (

      <div className="
        flex
        min-h-screen
        items-center
        justify-center
      ">
        Loading...
      </div>
    );
  }

  if (!data) {

    return (

      <div className="
        flex
        min-h-screen
        items-center
        justify-center
      ">
        Portfolio tidak ditemukan
      </div>
    );
  }

  const {
    portfolio,
    photos,
    coverImage,
  } = data;

  const imageUrl =
    coverImage?.url
      ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${coverImage.url}`
      : "/placeholder.jpg";

  console.log("IMAGE URL =", imageUrl);
  console.log("coverImage =", coverImage);
  console.log("coverImage.url =", coverImage?.url);

  return (

    <div className="
      bg-white
      text-black
    ">

      {/* ================= HERO ================= */}

      <section className="
        relative
        h-[520px]
        overflow-hidden
      ">

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

          <img
            src={imageUrl}
            alt={portfolio.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="
          absolute
          inset-0
          bg-black/55
        " />

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

          </div>

        </div>

      </section>

      {/* ================= CONTENT ================= */}

      <section className="
        px-6
        py-24
      ">

        <div className="
          mx-auto
          max-w-5xl
        ">

          <div className="
            mt-10
            flex
            flex-wrap
            gap-3
          ">

            {
              portfolio.layananIds?.map(
                (layanan) => (

                  <span
                    key={layanan._id}
                    className="
                      rounded-full
                      bg-black
                      px-5
                      py-3
                      text-sm
                      font-medium
                      text-white
                    "
                  >
                    {layanan.nama}
                  </span>
                )
              )
            }

          </div>

          <div className="
            prose
            mt-14
            max-w-none
            prose-neutral
          ">

            <div className="
              whitespace-pre-line
              text-lg
              leading-[2.1]
              text-neutral-700
            ">
              {portfolio.content}
            </div>

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

          <div className="
            mb-16
            text-center
          ">

            <p className="
              text-sm
              tracking-[0.35em]
              text-[#D4B36A]
            ">
              PORTFOLIO GALLERY
            </p>

            <h2 className="
              mt-5
              text-5xl
              font-bold
              tracking-tight
            ">
              Detail Dekorasi
            </h2>

          </div>

          <div className="
            grid
            gap-5
            md:grid-cols-2
          ">

            {
              photos.map(
                (
                  photo,
                  index
                ) => (

                  <button
                    key={photo._id}
                    onClick={() => {

                      setCurrentIndex(
                        index
                      );

                      setOpenLightbox(
                        true
                      );
                    }}
                    className="
                      group
                      relative
                      h-[420px]
                      overflow-hidden
                      rounded-[32px]
                    "
                  >

                  <div
                    className="
                      relative
                      h-full
                      w-full
                      bg-gray-300
                    "
                  >
                    {photo?.url ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${photo.url}`}
                        alt={portfolio.title}
                        fill
                        unoptimized
                        className="
                          object-cover
                          transition
                          duration-700
                          group-hover:scale-110
                        "
                      />
                    ) : (
                      <div
                        className="
                          absolute
                          inset-0
                          bg-gray-300
                        "
                      />
                    )}
                  </div>
                  </button>
                )
              )
            }

          </div>

        </div>

      </section>

      {/* ================= RELATED ================= */}

      {
        related.length > 0 && (

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
                  RELATED PORTFOLIO
                </p>

                <h2 className="
                  mt-5
                  text-5xl
                  font-bold
                  tracking-tight
                ">
                  Portfolio Serupa
                </h2>

              </div>

              <div className="
                grid
                gap-6
                md:grid-cols-2
                lg:grid-cols-4
              ">

                {
                  related.map(
                    (item) => (

                      <Link
                        key={item._id}
                        href={`/gallery/${item.slug}`}
                        className="
                          group
                          overflow-hidden
                          rounded-[28px]
                          bg-white
                        "
                      >

                        <div className="
                          relative
                          h-[320px]
                          overflow-hidden
                        ">

                        <div
                          className="
                            relative
                            h-full
                            w-full
                            bg-gray-300
                          "
                        >
                        {item.coverImage?.url ? (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.coverImage.url}`}
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
                        ) : (
                          <div
                            className="
                              absolute
                              inset-0
                              bg-gray-300
                            "
                          />
                        )}
                      </div>
                      
                        </div>

                        <div className="
                          p-6
                        ">

                          <div className="
                            mb-3
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
                                      bg-neutral-100
                                      px-3
                                      py-1
                                      text-xs
                                    "
                                  >
                                    {layanan.nama}
                                  </span>
                                )
                              )
                            }

                          </div>

                          <h3 className="
                            text-xl
                            font-bold
                          ">
                            {item.title}
                          </h3>

                          <p className="
                            mt-3
                            text-sm
                            leading-[1.8]
                            text-neutral-500
                          ">
                            {item.excerpt}
                          </p>

                        </div>

                      </Link>
                    )
                  )
                }

              </div>

            </div>

          </section>
        )
      }

      {/* ================= LIGHTBOX ================= */}

      <Lightbox
        open={openLightbox}
        close={() =>
          setOpenLightbox(false)
        }
        index={currentIndex}
        slides={
          photos.map((img) => ({
            src:
              `${process.env.NEXT_PUBLIC_IMAGE_URL}${img.url}`,
          }))
        }
        plugins={[
          Zoom,
          Thumbnails,
        ]}
      />

    </div>
  );
}