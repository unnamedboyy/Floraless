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

  const [loading, setLoading] =
    useState(false);

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
        username:
          initialData.userId?.username || "",
        password: "",
        no_telp:
          initialData.no_telp || "",
      });

    } else {

      setForm({
        nama: "",
        username: "",
        password: "",
        no_telp: "",
      });

    }

  }, [initialData, open]);

  if (!open) return null;

  const handleSubmit = async () => {

    try {

      setLoading(true);

      await onSubmit({
        ...form,
        role,
      });

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

      {/* CARD */}
      <div className="
        w-full
        max-w-lg
        bg-white
        rounded-3xl
        shadow-2xl
        overflow-hidden
        animate-in fade-in zoom-in-95 duration-200
      ">

        {/* HEADER */}
        <div className="px-6 py-5 border-b flex items-start justify-between">

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {initialData
                ? `Edit ${role}`
                : `Tambah ${role}`}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Lengkapi informasi pengguna
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              w-10 h-10
              rounded-2xl
              hover:bg-gray-100
              transition
              text-gray-500
            "
          >
            ✕
          </button>

        </div>

        {/* BODY */}
        <div className="p-6 space-y-5">

          {/* NAMA */}
          <FormField label="Nama Lengkap">

            <input
              placeholder="Masukkan nama lengkap"
              value={form.nama}
              onChange={(e) =>
                setForm({
                  ...form,
                  nama: e.target.value,
                })
              }
              className="
                w-full
                rounded-2xl
                border
                px-4 py-3
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-black
              "
            />

          </FormField>

          {/* USERNAME */}
          <FormField label="Username">

            <input
              placeholder="Masukkan username"
              value={form.username}
              onChange={(e) =>
                setForm({
                  ...form,
                  username: e.target.value,
                })
              }
              className="
                w-full
                rounded-2xl
                border
                px-4 py-3
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-black
              "
            />

          </FormField>

          {/* PASSWORD */}
          {!initialData && (

            <FormField label="Password">

              <input
                type="password"
                placeholder="Masukkan password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                className="
                  w-full
                  rounded-2xl
                  border
                  px-4 py-3
                  text-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-black
                "
              />

            </FormField>

          )}

          {/* NO TELP */}
          <FormField label="No Telepon">

            <input
              placeholder="08xxxxxxxxxx"
              value={form.no_telp}
              onChange={(e) =>
                setForm({
                  ...form,
                  no_telp: e.target.value,
                })
              }
              className="
                w-full
                rounded-2xl
                border
                px-4 py-3
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-black
              "
            />

          </FormField>

        </div>

        {/* FOOTER */}
        <div className="border-t px-6 py-4 flex gap-3">

          <button
            onClick={onClose}
            className="
              flex-1
              py-3
              rounded-2xl
              border
              hover:bg-gray-50
              transition
              text-sm
              font-medium
            "
          >
            Batal
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
              flex-1
              py-3
              rounded-2xl
              bg-black
              text-white
              hover:opacity-90
              transition
              text-sm
              font-medium
              disabled:opacity-50
            "
          >
            {loading
              ? "Menyimpan..."
              : "Simpan"}
          </button>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   FIELD
========================================================= */

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {

  return (
    <div className="space-y-2">

      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      {children}

    </div>
  );
}