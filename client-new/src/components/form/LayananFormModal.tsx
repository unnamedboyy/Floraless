"use client";

import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: any) => void;
  initialData?: any;
};

const formatRupiahInput = (value: string) => {
  const number = value.replace(/\D/g, "");

  if (!number) return "";

  return new Intl.NumberFormat("id-ID").format(
    Number(number)
  );
};

export default function LayananFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nama: "",
    harga: "",
    deskripsi: "",
  });

  useEffect(() => {

    if (initialData) {

      setForm({
        nama: initialData.nama || "",
        harga: initialData.harga
          ? String(initialData.harga)
          : "",
        deskripsi:
          initialData.deskripsi || "",
      });

    } else {

      setForm({
        nama: "",
        harga: "",
        deskripsi: "",
      });

    }

  }, [initialData, open]);

  const handleSubmit = async () => {

    try {

      setLoading(true);

      await onSubmit({
        ...form,
        harga: Number(
          form.harga.replace(/\D/g, "")
        ),
      });

    } finally {

      setLoading(false);

    }
  };

  if (!open) return null;

  return (
    <div className="
      fixed inset-0 z-50
      bg-black/40
      backdrop-blur-sm
      flex items-center justify-center
      p-4
    ">

      {/* CARD */}
      <div className="
        w-full
        max-w-2xl
        bg-white
        rounded-3xl
        shadow-2xl
        overflow-hidden
        animate-in fade-in zoom-in-95 duration-200
      ">

        {/* HEADER */}
        <div className="
          px-6 py-5
          border-b
          flex items-start justify-between
        ">

          <div>

            <h2 className="
              text-xl
              font-semibold
              text-gray-900
            ">
              {initialData
                ? "Edit Layanan"
                : "Tambah Layanan"}
            </h2>

            <p className="
              text-sm
              text-gray-500
              mt-1
            ">
              Kelola informasi layanan dekorasi
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
        <div className="p-6 space-y-6">

          {/* INFORMASI */}
          <div className="
            border
            rounded-3xl
            p-5
            bg-gray-50/70
            space-y-5
          ">

            <div>

              <h3 className="
                font-semibold
                text-gray-900
              ">
                Informasi Layanan
              </h3>

              <p className="
                text-sm
                text-gray-500
                mt-1
              ">
                Isi detail layanan yang tersedia
              </p>

            </div>

            {/* NAMA */}
            <FormField label="Nama Layanan">

              <input
                placeholder="Masukkan nama layanan"
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
                  bg-white
                  px-4 py-3
                  text-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-black
                "
              />

            </FormField>

            {/* HARGA */}
            <FormField label="Harga Layanan">

              <div className="relative">

                <div className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-sm
                  text-gray-500
                ">
                  Rp
                </div>

                <input
                  placeholder="0"
                  value={formatRupiahInput(
                    form.harga
                  )}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      harga:
                        e.target.value.replace(
                          /\D/g,
                          ""
                        ),
                    })
                  }
                  className="
                    w-full
                    rounded-2xl
                    border
                    bg-white
                    pl-12
                    pr-4
                    py-3
                    text-sm
                    focus:outline-none
                    focus:ring-2
                    focus:ring-black
                  "
                />

              </div>

            </FormField>

            {/* DESKRIPSI */}
            <FormField label="Deskripsi">

              <textarea
                placeholder="Masukkan deskripsi layanan"
                rows={5}
                value={form.deskripsi}
                onChange={(e) =>
                  setForm({
                    ...form,
                    deskripsi: e.target.value,
                  })
                }
                className="
                  w-full
                  rounded-2xl
                  border
                  bg-white
                  px-4 py-3
                  text-sm
                  resize-none
                  focus:outline-none
                  focus:ring-2
                  focus:ring-black
                "
              />

            </FormField>

          </div>

        </div>

        {/* FOOTER */}
        <div className="
          border-t
          px-6 py-5
          flex flex-col sm:flex-row gap-3
        ">

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
              : initialData
              ? "Simpan Perubahan"
              : "Tambah Layanan"}
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

      <label className="
        text-sm
        font-medium
        text-gray-700
      ">
        {label}
      </label>

      {children}

    </div>
  );
}