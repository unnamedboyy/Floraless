"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
};

export default function VoucherFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
}: Props) {
  const [form, setForm] = useState({
    code: "",
    pelangganId: "",
    amount: "",
    expiredAt: "",
  });

  const [pelanggan, setPelanggan] = useState<any[]>([]);

  useEffect(() => {
    fetchPelanggan();
  }, []);

  useEffect(() => {
    if (initialData) {
      setForm({
        code: initialData.code || "",
        pelangganId: initialData.pelangganId?._id || "",
        amount: initialData.amount || "",
        expiredAt: initialData.expiredAt?.slice(0, 10) || "",
      });
    }
  }, [initialData]);

  const fetchPelanggan = async () => {
    const res = await api.get("/auth/users/pelanggan?limit=100");
    setPelanggan(res.data.data);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-[400px] space-y-3">

        <h2 className="font-bold">
          {initialData ? "Edit Voucher" : "Tambah Voucher"}
        </h2>

        <input
          placeholder="Code"
          className="border p-2 w-full"
          value={form.code}
          onChange={(e) =>
            setForm({ ...form, code: e.target.value })
          }
        />

        <select
          className="border p-2 w-full"
          value={form.pelangganId}
          onChange={(e) =>
            setForm({ ...form, pelangganId: e.target.value })
          }
        >
          <option value="">-- Pilih Pelanggan --</option>
          {pelanggan.map((p) => (
            <option key={p._id} value={p._id}>
              {p.nama}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Amount"
          className="border p-2 w-full"
          value={form.amount}
          onChange={(e) =>
            setForm({ ...form, amount: e.target.value })
          }
        />

        <input
          type="date"
          className="border p-2 w-full"
          value={form.expiredAt}
          onChange={(e) =>
            setForm({ ...form, expiredAt: e.target.value })
          }
        />

        <div className="flex gap-2">
          <button
            onClick={() => onSubmit(form)}
            className="bg-black text-white w-full p-2"
          >
            Simpan
          </button>

          <button
            onClick={onClose}
            className="border w-full p-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}