"use client";

import { useState, useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  role: "pegawai" | "pelanggan";
};

export default function UserFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
  role,
}: Props) {
  const [form, setForm] = useState({
    nama: "",
    username: "",
    password: "",
    no_telp: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        nama: initialData.nama || "",
        username: initialData.userId?.username || "",
        password: "",
        no_telp: initialData.no_telp || "",
      });
    }
  }, [initialData]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-[400px] space-y-3">
        <h2 className="font-bold">
          {initialData ? "Edit" : "Tambah"} {role}
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
          placeholder="Username"
          className="border p-2 w-full"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        {!initialData && (
          <input
            placeholder="Password"
            type="password"
            className="border p-2 w-full"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
        )}

        <input
          placeholder="No Telp"
          className="border p-2 w-full"
          value={form.no_telp}
          onChange={(e) =>
            setForm({ ...form, no_telp: e.target.value })
          }
        />

        <div className="flex gap-2">
          <button
            onClick={() => onSubmit({ ...form, role })}
            className="bg-black text-white px-4 py-2 w-full"
          >
            Save
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