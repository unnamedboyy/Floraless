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

  const [loading, setLoading] =
    useState(false);

  const [loadingPelanggan, setLoadingPelanggan] =
    useState(false);

  const [form, setForm] = useState({
    code: "",
    pelangganId: "",
    amount: "",
    expiredAt: "",
  });

  const [pelanggan, setPelanggan] =
    useState<any[]>([]);

  useEffect(() => {

    if (open) {
      fetchPelanggan();
    }

  }, [open]);

  useEffect(() => {

    if (initialData) {

      setForm({
        code: initialData.code || "",
        pelangganId:
          initialData.pelangganId?._id || "",
        amount:
          initialData.amount || "",
        expiredAt:
          initialData.expiredAt?.slice(0, 10) || "",
      });

    } else {

      setForm({
        code: "",
        pelangganId: "",
        amount: "",
        expiredAt: "",
      });

    }

  }, [initialData, open]);

  const fetchPelanggan = async () => {

    try {

      setLoadingPelanggan(true);

      const res = await api.get(
        "/auth/users/pelanggan?limit=100"
      );

      setPelanggan(
        res.data.data || []
      );

    } catch (err) {

      console.error(err);

    } finally {

      setLoadingPelanggan(false);

    }
  };

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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

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
        <div className="px-6 py-5 border-b flex items-start justify-between">

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {initialData
                ? "Edit Voucher"
                : "Tambah Voucher"}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Kelola data voucher cashback pelanggan
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

          {/* CODE */}
          <FormField label="Kode Voucher">

            <input
              placeholder="Masukkan kode voucher"
              value={form.code}
              onChange={(e) =>
                setForm({
                  ...form,
                  code: e.target.value,
                })
              }
              className="
                w-full
                rounded-2xl
                border
                px-4 py-3
                text-sm
                uppercase
                focus:outline-none
                focus:ring-2
                focus:ring-black
              "
            />

          </FormField>

          {/* PELANGGAN */}
          <FormField label="Pelanggan">

            <select
              value={form.pelangganId}
              onChange={(e) =>
                setForm({
                  ...form,
                  pelangganId:
                    e.target.value,
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
            >

              <option value="">
                -- Pilih Pelanggan --
              </option>

              {pelanggan.map((p) => (

                <option
                  key={p._id}
                  value={p._id}
                >
                  {p.nama}
                </option>

              ))}

            </select>

            {loadingPelanggan && (
              <p className="text-xs text-gray-500">
                Loading pelanggan...
              </p>
            )}

          </FormField>

          {/* AMOUNT */}
          <FormField label="Nominal Voucher">

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
                type="number"
                placeholder="0"
                value={form.amount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    amount: e.target.value,
                  })
                }
                className="
                  w-full
                  rounded-2xl
                  border
                  pl-12 pr-4 py-3
                  text-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-black
                "
              />

            </div>

          </FormField>

          {/* EXPIRED */}
          <FormField label="Tanggal Expired">

            <input
              type="date"
              value={form.expiredAt}
              onChange={(e) =>
                setForm({
                  ...form,
                  expiredAt:
                    e.target.value,
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
              : initialData
              ? "Simpan Perubahan"
              : "Tambah Voucher"}
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