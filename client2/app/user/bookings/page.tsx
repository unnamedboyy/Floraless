"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import CalendarView from "@/components/calendar/CalendarView";

type Layanan = {
  _id: string;
  nama_layanan: string;
  harga: number;
};

export default function UserBookingPage() {

  const [offset, setOffset] = useState(0);

  const [layanan, setLayanan] = useState<Layanan[]>([]);
  const [selectedLayanan, setSelectedLayanan] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [info, setInfo] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const [showCalendar, setShowCalendar] = useState(false);

  /* ========================
     HERO PARALLAX
  ======================== */

  useEffect(() => {

    const handleScroll = () => {
      setOffset(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);

  }, []);

  /* ========================
     LOAD LAYANAN
  ======================== */

  useEffect(() => {

    async function load() {

      const data = await apiFetch("/layanan");
      setLayanan(data);

    }

    load();

  }, []);

  /* ========================
     SUBMIT BOOKING
  ======================== */

  async function submit(e: React.FormEvent) {

    e.preventDefault();

    setLoading(true);
    setSuccess("");

    try {

      await apiFetch("/ticket", {
        method: "POST",
        body: JSON.stringify({
          layanan: selectedLayanan,
          tanggal_acara: tanggal,
          info_acara: info,
        }),
      });

      setSuccess("Booking berhasil dibuat!");

      setSelectedLayanan("");
      setTanggal("");
      setInfo("");

    } catch (err: any) {

      alert(err.message);

    }

    setLoading(false);

  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">

      {/* HERO */}
      {/* <section className="relative h-[420px] w-full overflow-hidden">

        <div
          className="absolute inset-0 scale-110"
          style={{
            transform: `translateY(${offset * 0.3}px)`
          }}
        >
          <Image
            src="/hero.jpg"
            alt="Booking Floraless"
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative flex h-full items-center justify-center text-center px-6">

          <div className="max-w-3xl">

            <h1 className="text-4xl md:text-5xl font-semibold text-white">
              Booking Jadwal
            </h1>

            <p className="mt-6 text-white/80 leading-relaxed">
              Pilih layanan dekorasi yang Anda inginkan dan tentukan
              tanggal acara Anda. Tim Floraless akan memproses booking
              dan menghubungi Anda untuk konfirmasi selanjutnya.
            </p>

          </div>

        </div>

      </section> */}

      {/* HERO PARALLAX */}
      <section className="relative h-[520px] w-full overflow-hidden">

        <div
          className="absolute inset-0 scale-110"
          style={{
            transform: `translateY(${offset * 0.35}px)`
          }}
        >
          <Image
            src="/hero.jpg"
            alt="Contact Floraless"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <h1 className="text-5xl md:text-7xl font-semibold text-white leading-tight tracking-tight">
            Formulir Pemesanan
          </h1>
        </div>

      </section>

      {/* FORM */}

      <section className="mx-auto max-w-3xl px-6 py-24">

        <div className="border border-neutral-200 rounded-3xl p-10 shadow-sm">

          <h2 className="text-2xl font-semibold mb-8">
            Form Booking
          </h2>

          {success && (

            <div className="mb-6 p-4 rounded-lg bg-emerald-50 text-emerald-700 text-sm">
              {success}
            </div>

          )}

          <form onSubmit={submit} className="space-y-6">

            {/* LAYANAN */}

            <div>

              <label className="block text-sm mb-2 text-neutral-600">
                Pilih Layanan
              </label>

              <select
                value={selectedLayanan}
                onChange={(e) =>
                  setSelectedLayanan(e.target.value)
                }
                required
                className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-300"
              >

                <option value="">Pilih layanan</option>

                {layanan.map((l) => (

                  <option key={l._id} value={l._id}>
                    {l.nama_layanan} — Rp{" "}
                    {l.harga.toLocaleString()}
                  </option>

                ))}

              </select>

            </div>

            {/* TANGGAL */}

            <div>

              <label className="block text-sm mb-2 text-neutral-600">
                Tanggal Acara
              </label>

              <div className="flex gap-3">

                <input
                  value={tanggal || "Belum dipilih"}
                  readOnly
                  className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm bg-neutral-50"
                />

                <button
                  type="button"
                  onClick={() => setShowCalendar(true)}
                  className="px-4 bg-[#C9AE63] text-white rounded-lg text-sm"
                >
                  Pilih
                </button>

              </div>

            </div>

            {/* INFO */}

            <div>

              <label className="block text-sm mb-2 text-neutral-600">
                Info Acara
              </label>

              <textarea
                value={info}
                onChange={(e) => setInfo(e.target.value)}
                rows={4}
                placeholder="Contoh: Wedding indoor, 200 tamu..."
                className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-300"
              />

            </div>

            {/* BUTTON */}

            <button
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg text-sm hover:opacity-90 transition"
            >

              {loading
                ? "Memproses..."
                : "Buat Booking"}

            </button>

          </form>

        </div>

      </section>

      {/* CALENDAR MODAL */}

      {showCalendar && (

        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6">

          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl relative shadow-xl">

            <button
              onClick={() => setShowCalendar(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black"
            >
              ✕
            </button>

            <h3 className="text-lg font-semibold mb-6">
              Pilih Tanggal Acara
            </h3>

            <CalendarView
              role="user"
              onSelectDate={(date) => {
                setTanggal(date);
                setShowCalendar(false);
              }}
            />

          </div>

        </div>

      )}

    </div>
  );
}