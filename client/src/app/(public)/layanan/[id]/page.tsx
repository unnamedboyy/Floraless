"use client";

// import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import {
  getLayananById,
  getAllLayanan,
} from "@/services/layanan.service";

import {
  getPortfolios,
} from "@/services/portfolio.service";

export default function DetailLayananPage() {

  const params =
    useParams();

  const id =
    params?.id as string;

  const [offset, setOffset] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [layanan, setLayanan] =
    useState<any>(null);

  const [portfolio, setPortfolio] =
    useState<any[]>([]);

  const [related, setRelated] =
    useState<any[]>([]);

  /* =====================================================
     PARALLAX
  ===================================================== */

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

  /* =====================================================
     FETCH
  ===================================================== */

  useEffect(() => {

    if (!id)
      return;

    const fetchData =
      async () => {

        try {

          setLoading(true);

          const [

            layananRes,

            portfolioRes,

            layananAllRes,

          ] = await Promise.all([

            getLayananById(id),

            getPortfolios(),

            getAllLayanan(),
          ]);

          const layananData =

            layananRes?.data ||

            layananRes;

          const portfolioData =

            portfolioRes?.data ||

            portfolioRes ||

            [];

          const layananAll =

            layananAllRes?.data ||

            layananAllRes ||

            [];

          const filteredPortfolio =

            portfolioData.filter(
              (item: any) =>

                item?.layananIds?.some(
                  (l: any) =>

                    l._id === id
                )
            );

          setLayanan(
            layananData
          );

          setPortfolio(
            filteredPortfolio
          );

          setRelated(

            layananAll.filter(
              (l: any) =>

                l._id !== id
            )
          );

        } catch (err) {

          console.error(err);

        } finally {

          setLoading(false);
        }
      };

    fetchData();

  }, [id]);

  /* =====================================================
     HERO COVER
  ===================================================== */

const IMAGE_URL =
  process.env.NEXT_PUBLIC_IMAGE_URL || "";

const cover = useMemo(() => {
  if (
    layanan?.thumbnail &&
    typeof layanan.thumbnail === "string"
  ) {
    if (
      layanan.thumbnail.startsWith("http://") ||
      layanan.thumbnail.startsWith("https://")
    ) {
      return layanan.thumbnail;
    }

    return `${IMAGE_URL}${layanan.thumbnail}`;
  }

  return "/service-default.jpg";
}, [layanan, IMAGE_URL]);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {

    return (

      <main
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-white
        "
      >
        Loading...
      </main>
    );
  }

  /* =====================================================
     UI
  ===================================================== */

  return (

    <main className="
      overflow-hidden
      bg-white
    ">

      {/* =================================================
         HERO
      ================================================= */}

      <section
        className="
          relative
          h-[700px]
          overflow-hidden
        "
      >

        {/* IMAGE */}
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

        <img
          src={cover}
          alt={layanan?.nama || "service"}
          className="
            h-full
            w-full
            object-cover
            scale-105
          "
        />

        </div>

        {/* OVERLAY */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/80
            via-black/45
            to-black/20
          "
        />

        {/* CONTENT */}
        <div
          className="
            relative
            z-10
            flex
            h-full
            items-center
            px-6
          "
        >

          <div
            className="
              mx-auto
              w-full
              max-w-7xl
            "
          >

            <div
              className="
                max-w-4xl
              "
            >

              <p
                className="
                  text-sm
                  tracking-[0.35em]
                  text-[#D4B36A]
                "
              >
                FLORALESS SERVICE
              </p>

              <h1
                className="
                  mt-6
                  text-5xl
                  font-semibold
                  tracking-tight
                  text-white
                  md:text-7xl
                "
              >
                {layanan?.nama}
              </h1>

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
         CONTENT
      ================================================= */}

      <section className="
        py-24
      ">

        <div
          className="
            mx-auto
            max-w-7xl
            px-6
          "
        >

          {/* =================================================
             INFO
          ================================================= */}

          <div
            className="
              grid
              gap-10
              lg:grid-cols-12
            "
          >

            {/* LEFT */}
            <div
              className="
                lg:col-span-7
              "
            >

              <p
                className="
                  text-sm
                  tracking-[0.3em]
                  text-[#C9AE63]
                "
              >
                DETAIL LAYANAN
              </p>

              <h2
                className="
                  mt-5
                  text-4xl
                  font-semibold
                  leading-tight
                  tracking-tight
                  md:text-6xl
                "
              >
                Konsep Dekorasi
                Premium
              </h2>

              <div
                className="
                  mt-10
                  space-y-6
                  text-lg
                  leading-relaxed
                  text-neutral-600
                "
              >

                <p>
                  {
                    layanan?.deskripsi ||

                    "Floraless menghadirkan layanan dekorasi eksklusif dengan sentuhan modern dan elegan."
                  }
                </p>

                <p>
                  Tim Floraless membantu
                  mulai dari konsultasi,
                  penyesuaian tema,
                  hingga realisasi dekorasi
                  secara profesional.
                </p>

              </div>

            </div>

            {/* RIGHT */}
            <div
              className="
                lg:col-span-5
              "
            >

              <div
                className="
                  overflow-hidden
                  rounded-[36px]
                  border
                  border-[#EFE7DA]
                  bg-[#FAF7F2]
                "
              >

                {/* IMAGE */}
                <div
                  className="
                    relative
                    h-[260px]
                  "
                >

                <img
                  src={cover}
                  alt={layanan?.nama || "service"}
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />

                </div>

                {/* CONTENT */}
                <div
                  className="
                    p-8
                  "
                >

                  <p
                    className="
                      text-sm
                      tracking-[0.3em]
                      text-[#C9AE63]
                    "
                  >
                    SERVICE INFO
                  </p>

                  <div
                    className="
                      mt-8
                      space-y-8
                    "
                  >

                    <div>

                      <p
                        className="
                          text-xs
                          uppercase
                          tracking-[0.2em]
                          text-neutral-400
                        "
                      >
                        Harga
                      </p>

                      <p
                        className="
                          mt-3
                          text-4xl
                          font-semibold
                        "
                      >
                        Rp{" "}
                        {
                          (
                            layanan?.harga || 0
                          ).toLocaleString(
                            "id-ID"
                          )
                        }
                      </p>

                    </div>

                  </div>

                  <Link
                    href="/booking"
                    className="
                      mt-10
                      flex
                      h-14
                      items-center
                      justify-center
                      rounded-full
                      bg-black
                      text-sm
                      font-medium
                      text-white
                      transition
                      hover:bg-neutral-800
                    "
                  >
                    Booking Sekarang
                  </Link>

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
             PORTFOLIO
          ================================================= */}

          <div
            className="
              mt-28
            "
          >

            <div
              className="
                flex
                items-end
                justify-between
                gap-6
                flex-wrap
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
                  RELATED PORTFOLIO
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
                  Portfolio
                  Terkait
                </h2>

              </div>

            </div>

            {
              portfolio.length === 0 ? (

                <div
                  className="
                    mt-12
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
                    Belum Ada Portfolio
                  </h3>

                  <p
                    className="
                      mt-4
                      text-neutral-500
                    "
                  >
                    Portfolio layanan ini
                    belum tersedia.
                  </p>

                </div>

              ) : (

                <div
                  className="
                    mt-14
                    grid
                    gap-8
                    md:grid-cols-2
                    xl:grid-cols-3
                  "
                >

                  {
                    portfolio.map((item:any)=>{

                      const imagePath =
                        item?.coverImage?.url ||
                        item?.images?.[0]?.url;

                      const imageUrl =
                        imagePath
                          ? imagePath.startsWith("http")
                            ? imagePath
                            : `${process.env.NEXT_PUBLIC_IMAGE_URL}${imagePath}`
                          : "/service-default.jpg";

                      return (

                        <Link
                          key={item._id}
                          href={`/gallery/${item.slug}`}
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

                          {/* IMAGE */}
                          <div
                            className="
                              relative
                              h-[320px]
                              overflow-hidden
                            "
                          >

                          <img
                            src={imageUrl}
                            alt={item.title}
                            className="
                              h-full
                              w-full
                              object-cover
                              transition
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
                                from-black/60
                                via-black/10
                                to-transparent
                              "
                            />

                            {/* BADGE */}
                            <div
                              className="
                                absolute
                                left-5
                                top-5
                                rounded-full
                                bg-white/90
                                px-4
                                py-2
                                text-xs
                                font-medium
                                tracking-[0.2em]
                                text-black
                                backdrop-blur
                              "
                            >
                              PORTFOLIO
                            </div>

                          </div>

                          {/* CONTENT */}
                          <div
                            className="
                              p-6
                            "
                          >

                            <h3
                              className="
                                text-2xl
                                font-semibold
                                transition
                                group-hover:text-[#C9AE63]
                              "
                            >
                              {item.title}
                            </h3>

                            <p
                              className="
                                mt-4
                                line-clamp-3
                                leading-relaxed
                                text-neutral-600
                              "
                            >
                              {
                                item.excerpt ||

                                "Portfolio dekorasi premium Floraless."
                              }
                            </p>

                          </div>

                        </Link>
                      )
                    })
                  }

                </div>
              )
            }

          </div>
        </div>
      </section>

    </main>
  );
}