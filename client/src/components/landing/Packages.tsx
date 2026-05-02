"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import layananService, { Layanan } from "../../services/layanan.service";
import Link from "next/link";

export default function Packages() {
  const [list, setList]       = useState<Layanan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    layananService.getAll()
      .then(setList)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="packages" className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-6">
            <h2 className="text-4xl md:text-5xl font-semibold leading-tight">
              Pilih Paket Dekorasi<br/>Sesuai Kebutuhan
            </h2>
          </div>
          <div className="md:col-span-6">
            <p className="text-neutral-600 leading-relaxed">
              Kami menyediakan berbagai pilihan layanan dekorasi gereja dan event
              yang dapat disesuaikan dengan kebutuhan dan konsep acara Anda.
            </p>
          </div>
        </div>

        {loading && <div className="mt-16 text-center text-neutral-400">Memuat layanan...</div>}

        {!loading && (
          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {list.map((layanan) => (
              <div key={layanan._id}
                className="group overflow-hidden rounded-3xl shadow-lg transition hover:-translate-y-2 hover:shadow-xl">
                <div className="relative h-[550px]">
                  <Image src={"/package-1.jpg"} alt={layanan.nama} fill className="object-cover"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"/>
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <h3 className="text-xl font-semibold">{layanan.nama}</h3>
                    {layanan.deskripsi && (
                      <p className="mt-2 text-sm text-white/80 line-clamp-2">{layanan.deskripsi}</p>
                    )}
                    <p className="mt-2 text-[#C9AE63] font-semibold text-sm">
                      Rp {layanan.harga.toLocaleString("id-ID")}
                    </p>
                    <Link href="/layanan"
                      className="mt-6 inline-flex items-center justify-center rounded-full bg-white text-black px-6 py-2 text-sm font-medium hover:bg-neutral-200 transition">
                      Lihat Selengkapnya
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {list.length === 0 && (
              <div className="col-span-full text-center text-neutral-400">Belum ada paket tersedia.</div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}