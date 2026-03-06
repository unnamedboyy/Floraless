"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { apiFetch } from "@/lib/api";

type Layanan = {
  _id: string;
  nama_layanan: string;
  deskripsi?: string;
  gambar?: string;
  fitur?: string[];
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
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* HEADER */}
        <div className="grid gap-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-6">
            {/* <h2 className="text-2xl font-semibold">
              Pilih Paket Dekorasi <br /> Sesuai Kebutuhan
            </h2> */}

            <h2 className="text-left text-4xl font-semibold text-black md:text-5xl">
              Pilih Paket Dekorasi <br /> Sesuai Kebutuhan
            </h2>
          </div>
          <div className="md:col-span-6">
            <p className="text-sm leading-relaxed text-neutral-600">
              Kami menyediakan berbagai pilihan layanan dekorasi gereja dan event
              yang dapat disesuaikan dengan kebutuhan dan konsep acara Anda.
            </p>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="mt-10 text-center text-neutral-500">
            Loading packages...
          </div>
        )}

        {/* LIST LAYANAN */}
        {!loading && (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {layananList.map((layanan) => (
              <div
                key={layanan._id}
                className="group relative overflow-hidden rounded-2xl border border-neutral-200 shadow-sm transition hover:shadow-lg"
              >
                {/* IMAGE */}
                <div className="relative h-[420px]">
                  <Image
                    src={layanan.gambar || "/package-1.jpg"}
                    alt={layanan.nama_layanan}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50" />
                </div>

                {/* CONTENT */}
                <div className="absolute inset-x-0 bottom-0 flex justify-center pb-8 px-6">

                  <div className="text-center text-white max-w-sm">

                    <h3 className="text-xl font-semibold">
                      {layanan.nama_layanan}
                    </h3>

                    {layanan.deskripsi && (
                      <p className="mt-2 text-sm text-white/85 line-clamp-2">
                        {layanan.deskripsi}
                      </p>
                    )}

                    <a
                      href="/login"
                      className="mt-4 inline-block rounded-full bg-[#C9AE63] px-6 py-2 text-xs font-semibold hover:opacity-90 transition"
                    >
                      Booking Sekarang
                    </a>

                  </div>

                </div>
              </div>
            ))}

            {/* EMPTY STATE */}
            {layananList.length === 0 && (
              <div className="col-span-full text-center text-neutral-500">
                Belum ada paket tersedia.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
