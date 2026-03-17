"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { apiFetch } from "@/lib/api";

type Layanan = {
  _id: string;
  nama_layanan: string;
  deskripsi?: string;
  gambar?: string;
};

export default function Packages() {
  const [layananList, setLayananList] = useState<Layanan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLayanan = async () => {
      try {
        const data = await apiFetch("/layanan");
        setLayananList(data);
      } catch (err) {
        console.error("Gagal load layanan:", err);
      } finally {
        setLoading(false);
      }
    };

    loadLayanan();
  }, []);

  return (
    <section id="packages" className="bg-white">

      <div className="mx-auto max-w-7xl px-6 py-24">

        {/* HEADER (TETAP SEPERTI SEBELUMNYA) */}

        <div className="grid md:grid-cols-12 gap-10 items-start">

          <div className="md:col-span-6">

            <h2 className="text-4xl md:text-5xl font-semibold leading-tight">
              Pilih Paket Dekorasi <br /> Sesuai Kebutuhan
            </h2>

          </div>

          <div className="md:col-span-6">

            <p className="text-neutral-600 leading-relaxed">
              Kami menyediakan berbagai pilihan layanan dekorasi gereja dan
              event yang dapat disesuaikan dengan kebutuhan dan konsep acara
              Anda.
            </p>

          </div>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="mt-16 text-center text-neutral-400">
            Loading packages...
          </div>
        )}

        {/* GRID */}

        {!loading && (

          <div className="mt-16 grid gap-10 md:grid-cols-3">

            {layananList.map((layanan) => {

              const points =
                layanan.deskripsi?.split("\n") || [];

              return (
              <div
                key={layanan._id}
                className="group overflow-hidden rounded-3xl shadow-lg transition hover:-translate-y-2 hover:shadow-xl"
              >

                {/* IMAGE */}
                <div className="relative h-[550px]">

                  <Image
                    src={layanan.gambar || "/package-1.jpg"}
                    alt={layanan.nama_layanan}
                    fill
                    className="object-cover"
                  />

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  {/* CONTENT */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">

                    <h3 className="text-xl font-semibold">
                      {layanan.nama_layanan}
                    </h3>

                    {points[0] && (
                      <p className="mt-2 text-sm text-white/80">
                        {points[0]}
                      </p>
                    )}

                    {/* TAGS */}
                    <div className="mt-3 flex flex-wrap gap-2">

                      {points.slice(1, 5).map((p,i) => (
                        <span
                          key={i}
                          className="rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur"
                        >
                          {p}
                        </span>
                      ))}

                    </div>

                    {/* BUTTON */}
                    <a
                      href="/layanan"
                      className="mt-6 inline-flex items-center justify-center rounded-full bg-white text-black px-6 py-2 text-sm font-medium hover:bg-neutral-200 transition"
                    >
                      Lihat Selengkapnya
                    </a>

                  </div>

                </div>

              </div>

              );

            })}

            {/* EMPTY */}

            {layananList.length === 0 && (

              <div className="col-span-full text-center text-neutral-400">

                Belum ada paket tersedia.

              </div>

            )}

          </div>

        )}

      </div>

    </section>
  );
}