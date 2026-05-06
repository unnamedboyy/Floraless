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

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
    tanggal_acara: "",
    lokasi: "",
    pegawaiId: "",
  });

  useEffect(() => {

    if (initialData) {

      setForm({
        tanggal_acara:
          initialData.tanggal_acara
            ? initialData.tanggal_acara.slice(
                0,
                10
              )
            : "",

        lokasi:
          initialData.lokasi || "",

        pegawaiId:
          initialData.pegawaiId?._id ||
          "",
      });

    } else {

      setForm({
        tanggal_acara: "",
        lokasi: "",
        pegawaiId: "",
      });

    }

  }, [initialData, open]);

  const handleSubmit = async () => {

    try {

      setLoading(true);

      await onSubmit(form);

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
                ? "Edit Jadwal"
                : "Tambah Jadwal"}
            </h2>

            <p className="
              text-sm
              text-gray-500
              mt-1
            ">
              Atur jadwal dekorasi dan penugasan pegawai
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

          {/* JADWAL */}
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
                Informasi Jadwal
              </h3>

              <p className="
                text-sm
                text-gray-500
                mt-1
              ">
                Tentukan tanggal dan lokasi acara
              </p>

            </div>

            {/* TANGGAL */}
            <FormField label="Tanggal Acara">

              <input
                type="date"
                value={form.tanggal_acara}
                onChange={(e) =>
                  setForm({
                    ...form,
                    tanggal_acara:
                      e.target.value,
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

            {/* LOKASI */}
            <FormField label="Lokasi Acara">

              <textarea
                rows={4}
                placeholder="Masukkan lokasi acara"
                value={form.lokasi}
                onChange={(e) =>
                  setForm({
                    ...form,
                    lokasi:
                      e.target.value,
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

          {/* PEGAWAI */}
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
                Penugasan Pegawai
              </h3>

              <p className="
                text-sm
                text-gray-500
                mt-1
              ">
                Tentukan pegawai yang bertanggung jawab
              </p>

            </div>

            <FormField label="Pegawai ID">

              <input
                type="text"
                placeholder="Masukkan pegawaiId"
                value={form.pegawaiId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pegawaiId:
                      e.target.value,
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
              : "Tambah Jadwal"}
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