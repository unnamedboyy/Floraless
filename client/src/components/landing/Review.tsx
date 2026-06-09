"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";
import {
  Quote,
  Star,
} from "lucide-react";

type Review = {
  _id: string;
  rating: number;
  komentar: string;
  pelangganId: {
    nama: string;
    profile?: string;
  };
  ticketId: {
    layananId?: {
      nama_layanan?: string;
    };
  };
};

export default function Testimonials() {

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadReviews = async () => {
      try {

        const res = await api.get(
          "/reviews/public"
        );

        setReviews(res.data);

      } catch (err) {

        console.error(
          "Gagal load review:",
          err
        );

      } finally {

        setLoading(false);

      }

    };

    loadReviews();

  }, []);

  return (
    <section
      id="testimonials"
      className="
        bg-[#f7f7f7]
        py-24
      "
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* HEADER */}

        <div className="text-center">

          <p
            className="
              text-sm
              font-medium
              tracking-[0.25em]
              uppercase
              text-[#c7ab63]
            "
          >
            Testimoni Client
          </p>

          <h2
            className="
              mt-4
              text-4xl
              font-bold
              tracking-tight
              text-[#111]
              md:text-5xl
            "
          >
            Kata Mereka Tentang Layanan Kami
          </h2>

          <p
            className="
              mx-auto
              mt-6
              max-w-2xl
              text-base
              leading-relaxed
              text-neutral-500
            "
          >
            Pengalaman nyata pelanggan Floraless
            dalam menggunakan layanan dekorasi
            kami untuk hari spesial mereka.
          </p>

        </div>

        {/* LOADING */}

        {loading && (
          <div
            className="
              mt-16
              text-center
              text-neutral-400
            "
          >
            Loading reviews...
          </div>
        )}

        {/* GRID */}

        {!loading && (
          <div
            className="
              mt-20
              grid
              gap-7
              md:grid-cols-2
              lg:grid-cols-3
            "
          >

            {reviews.map((review) => (

              <div
                key={review._id}
                className="
                  rounded-[28px]
                  border
                  border-neutral-200
                  bg-white
                  p-7
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-xl
                "
              >

                {/* TOP */}

                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-4
                  "
                >

                  <div className="flex items-center gap-4">

                    {/* AVATAR */}
                    <div
                      className="
                        h-16
                        w-16
                        overflow-hidden
                        rounded-full
                        border
                        border-neutral-200
                        flex-shrink-0
                      "
                    >
                      <Image
                        src={
                          review.pelangganId?.profile || "/images/default-avatar.png"
                        }
                        alt={review.pelangganId?.nama || "Pelanggan"}
                        width={64}
                        height={64}
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* INFO */}

                    <div>

                      <h3
                        className="
                          text-lg
                          font-semibold
                          text-[#111]
                        "
                      >
                        {
                          review.pelangganId?.nama
                        }
                      </h3>

                      <p
                        className="
                          mt-1
                          text-sm
                          text-neutral-500
                        "
                      >
                        {
                          review.ticketId
                            ?.layananId
                            ?.nama_layanan
                        }
                      </p>

                      {/* STARS */}

                      <div
                        className="
                          mt-3
                          flex
                          items-center
                          gap-1
                        "
                      >

                        {[...Array(review.rating)].map(
                          (_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className="
                                fill-[#ff7a00]
                                text-[#ff7a00]
                              "
                            />
                          )
                        )}

                        <span
                          className="
                            ml-1
                            text-sm
                            font-medium
                            text-neutral-700
                          "
                        >
                          {review.rating}.0
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* QUOTE ICON */}

                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-full
                      bg-[#fff3eb]
                    "
                  >
                    <Quote
                      size={22}
                      className="text-[#ff7a00]"
                    />
                  </div>

                </div>

                {/* COMMENT */}

                <p
                  className="
                    mt-7
                    text-[15px]
                    leading-8
                    text-neutral-500
                  "
                >
                  {review.komentar}
                </p>

              </div>

            ))}

            {/* EMPTY */}

            {reviews.length === 0 && (

              <div
                className="
                  col-span-full
                  rounded-3xl
                  border
                  border-[#0C0908]/10
                  bg-white/5
                  p-10
                  text-center
                  text-[#0C0908]/50
                "
              >
                Belum ada review tersedia.
              </div>

            )}

          </div>
        )}

      </div>
    </section>
  );
}