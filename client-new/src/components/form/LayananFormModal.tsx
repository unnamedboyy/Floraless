"use client";

import { useEffect, useState } from "react";

export default function LayananFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
}: any) {
  const [form, setForm] = useState({
    nama: "",
    harga: "",
    deskripsi: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        nama: initialData.nama || "",
        harga: initialData.harga || "",
        deskripsi: initialData.deskripsi || "",
      });
    }
  }, [initialData]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-[400px] space-y-3">
        <h2 className="font-semibold text-lg">
          Form Layanan
        </h2>

        <input
          placeholder="Nama"
          className="border p-2 w-full"
          value={form.nama}
          onChange={(e) =>
            setForm({ ...form, nama: e.target.value })
          }
        />

        <input
          placeholder="Harga"
          className="border p-2 w-full"
          value={form.harga}
          onChange={(e) =>
            setForm({ ...form, harga: e.target.value })
          }
        />

        <textarea
          placeholder="Deskripsi"
          className="border p-2 w-full"
          value={form.deskripsi}
          onChange={(e) =>
            setForm({ ...form, deskripsi: e.target.value })
          }
        />

        <div className="flex gap-2">
          <button
            onClick={() => onSubmit(form)}
            className="bg-black text-white px-3 py-2 w-full"
          >
            Submit
          </button>

          <button
            onClick={onClose}
            className="border px-3 py-2 w-full"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}