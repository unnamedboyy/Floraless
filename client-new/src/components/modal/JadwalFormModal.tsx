"use client";

import { useEffect, useState } from "react";
import { getPegawaiList } from "@/services/pegawai.service";

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
    title: "",
    lokasi: "",
    pegawaiId: "",
  });

  const [pegawai, setPegawai] = useState<any[]>([]);

  useEffect(() => {
    if (open) fetchPegawai();
  }, [open]);

  useEffect(() => {
    if (initialData) {
      setForm({
        tanggal_acara: initialData.tanggal_acara?.slice(0, 10) || "",
        title: initialData.title || "",
        lokasi: initialData.lokasi || "",
        pegawaiId: initialData.pegawaiId?._id || "",
      });
    } else {
      setForm({
        tanggal_acara: "",
        title: "",
        lokasi: "",
        pegawaiId: "",
      });
    }
  }, [initialData]);

  const fetchPegawai = async () => {
    try {
      const res = await getPegawaiList();
      setPegawai(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-[420px] space-y-3">

        <h2 className="font-bold">
          {initialData ? "Edit Jadwal" : "Tambah Jadwal"}
        </h2>

        <input
          type="date"
          className="border p-2 w-full"
          value={form.tanggal_acara}
          onChange={(e) =>
            setForm({ ...form, tanggal_acara: e.target.value })
          }
        />

        <input
          placeholder="Title"
          className="border p-2 w-full"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <input
          placeholder="Lokasi"
          className="border p-2 w-full"
          value={form.lokasi}
          onChange={(e) =>
            setForm({ ...form, lokasi: e.target.value })
          }
        />

        <select
          className="border p-2 w-full"
          value={form.pegawaiId}
          onChange={(e) =>
            setForm({ ...form, pegawaiId: e.target.value })
          }
        >
          <option value="">-- Tanpa Pegawai --</option>
          {pegawai.map((p) => (
            <option key={p._id} value={p._id}>
              {p.nama}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <button
            onClick={() => onSubmit(form)}
            className="bg-black text-white px-4 py-2 w-full"
          >
            Simpan
          </button>

          <button
            onClick={onClose}
            className="border px-4 py-2 w-full"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}