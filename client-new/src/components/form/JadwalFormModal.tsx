"use client";

import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
};

export default function JadwalFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
}: Props) {
  const [form, setForm] = useState({
    tanggal_acara: "",
    lokasi: "",
    pegawaiId: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        tanggal_acara: initialData.tanggal_acara
          ? initialData.tanggal_acara.slice(0, 10)
          : "",
        lokasi: initialData.lokasi || "",
        pegawaiId: initialData.pegawaiId?._id || "",
      });
    } else {
      setForm({
        tanggal_acara: "",
        lokasi: "",
        pegawaiId: "",
      });
    }
  }, [initialData]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl p-6 w-[400px] space-y-4">

        <h2 className="text-lg font-semibold">
          {initialData ? "Edit Jadwal" : "Tambah Jadwal"}
        </h2>

        {/* TANGGAL */}
        <div>
          <p className="text-sm">Tanggal Acara</p>
          <input
            type="date"
            value={form.tanggal_acara}
            onChange={(e) =>
              setForm({ ...form, tanggal_acara: e.target.value })
            }
            className="border w-full px-3 py-2 rounded"
          />
        </div>

        {/* LOKASI */}
        <div>
          <p className="text-sm">Lokasi</p>
          <input
            type="text"
            value={form.lokasi}
            onChange={(e) =>
              setForm({ ...form, lokasi: e.target.value })
            }
            className="border w-full px-3 py-2 rounded"
            placeholder="Masukkan lokasi"
          />
        </div>

        {/* PEGAWAI */}
        <div>
          <p className="text-sm">Pegawai ID</p>
          <input
            type="text"
            value={form.pegawaiId}
            onChange={(e) =>
              setForm({ ...form, pegawaiId: e.target.value })
            }
            className="border w-full px-3 py-2 rounded"
            placeholder="Masukkan pegawaiId"
          />
        </div>

        {/* ACTION */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Batal
          </button>

          <button
            onClick={() => onSubmit(form)}
            className="px-4 py-2 bg-black text-white rounded"
          >
            Simpan
          </button>
        </div>

      </div>
    </div>
  );
}