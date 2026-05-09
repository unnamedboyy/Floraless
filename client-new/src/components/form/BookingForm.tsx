"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { createTicket } from "@/services/ticket.service";

import { useLayanan } from "@/hooks/useLayanan";

export default function BookingForm() {

  const router = useRouter();

  const {
    data: layananList,
  } = useLayanan({});

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    layananId: "",
    tanggal: "",
    lokasi: "",
    nama_acara: "",
    catatan: "",
  });

  /* =========================================================
     HANDLE CHANGE
  ========================================================= */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      setLoading(true);

      await createTicket(form);

      alert(
        "Pemesanan berhasil dibuat"
      );

      router.push(
        "/profile/orders"
      );

    } catch (err: any) {

      console.error(err);

      alert(
        err?.response?.data?.message ||
        "Gagal membuat pemesanan"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-sm md:p-12"
    >

      <div className="grid gap-8 md:grid-cols-2">

        {/* =====================================================
           NAMA ACARA
        ===================================================== */}

        <div className="md:col-span-2">

          <label className="mb-3 block text-sm font-semibold text-neutral-700">
            Nama Acara
          </label>

          <input
            type="text"
            name="nama_acara"
            value={form.nama_acara}
            onChange={handleChange}
            required
            placeholder="Contoh: Wedding Andini & Rizky"
            className="w-full rounded-2xl border border-neutral-300 px-5 py-4 outline-none transition focus:border-black"
          />

        </div>

        {/* =====================================================
           LAYANAN
        ===================================================== */}

        <div>

          <label className="mb-3 block text-sm font-semibold text-neutral-700">
            Pilih Layanan
          </label>

          <select
            name="layananId"
            value={form.layananId}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border border-neutral-300 px-5 py-4 outline-none transition focus:border-black"
          >

            <option value="">
              Pilih layanan
            </option>

            {
              layananList?.map((item: any) => (

                <option
                  key={item._id}
                  value={item._id}
                >
                  {item.nama}
                </option>
              ))
            }

          </select>

        </div>

        {/* =====================================================
           TANGGAL
        ===================================================== */}

        <div>

          <label className="mb-3 block text-sm font-semibold text-neutral-700">
            Tanggal Acara
          </label>

          <input
            type="date"
            name="tanggal"
            value={form.tanggal}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border border-neutral-300 px-5 py-4 outline-none transition focus:border-black"
          />

        </div>

        {/* =====================================================
           LOKASI
        ===================================================== */}

        <div className="md:col-span-2">

          <label className="mb-3 block text-sm font-semibold text-neutral-700">
            Lokasi Acara
          </label>

          <input
            type="text"
            name="lokasi"
            value={form.lokasi}
            onChange={handleChange}
            required
            placeholder="Contoh: Hotel Royal Ambarrukmo"
            className="w-full rounded-2xl border border-neutral-300 px-5 py-4 outline-none transition focus:border-black"
          />

        </div>

        {/* =====================================================
           CATATAN
        ===================================================== */}

        <div className="md:col-span-2">

          <label className="mb-3 block text-sm font-semibold text-neutral-700">
            Catatan Tambahan
          </label>

          <textarea
            rows={6}
            name="catatan"
            value={form.catatan}
            onChange={handleChange}
            placeholder="Tuliskan tema, konsep acara, atau request tambahan"
            className="w-full rounded-2xl border border-neutral-300 px-5 py-4 outline-none transition focus:border-black"
          />

        </div>

      </div>

      {/* =======================================================
         SUBMIT
      ======================================================= */}

      <div className="mt-10 flex justify-end">

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-black px-8 py-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {
            loading
              ? "Mengirim..."
              : "Kirim Pemesanan"
          }
        </button>

      </div>

    </form>
  );
}
