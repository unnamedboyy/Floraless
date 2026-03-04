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
                <div className="absolute inset-x-0 top-0 p-6 text-white">
                  <h3 className="text-xl font-semibold">
                    {layanan.nama_layanan}
                  </h3>

                  {layanan.deskripsi && (
                    <p className="mt-3 text-sm text-white/85 line-clamp-3">
                      {layanan.deskripsi}
                    </p>
                  )}

                  {layanan.fitur && layanan.fitur.length > 0 && (
                    <ul className="mt-4 space-y-2 text-sm text-white/90">
                      {layanan.fitur.slice(0, 3).map((f, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="mt-1 inline-block h-3 w-3 rounded-full bg-[#C9AE63]" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <a
                    href="/login"
                    className="mt-6 inline-block rounded-full bg-[#C9AE63] px-5 py-2 text-xs font-semibold hover:opacity-90"
                  >
                    Booking Sekarang
                  </a>
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
