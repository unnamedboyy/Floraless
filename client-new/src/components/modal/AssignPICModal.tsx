"use client";

import { useEffect, useState } from "react";
import { getPegawaiList } from "@/services/pegawai.service";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (pegawaiId: string) => void;
};

export default function AssignPICModal({
  open,
  onClose,
  onSubmit,
}: Props) {

  const [pegawai, setPegawai] =
    useState<any[]>([]);

  const [selected, setSelected] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [loadingPegawai, setLoadingPegawai] =
    useState(false);

  useEffect(() => {

    if (open) {
      fetchPegawai();
    }

  }, [open]);

  const fetchPegawai = async () => {

    try {

      setLoadingPegawai(true);

      const res =
        await getPegawaiList();

      setPegawai(
        res.data.data || []
      );

    } catch (err) {

      console.error(err);

    } finally {

      setLoadingPegawai(false);

    }
  };

  const handleSubmit = async () => {

    if (!selected) return;

    try {

      setLoading(true);

      await onSubmit(selected);

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
              Assign PIC
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Pilih pegawai yang akan menjadi PIC ticket
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

          {/* SELECT */}
          <div className="space-y-2">

            <label className="text-sm font-medium text-gray-700">
              Pegawai
            </label>

            <select
              value={selected}
              onChange={(e) =>
                setSelected(
                  e.target.value
                )
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
                Pilih Pegawai
              </option>

              {pegawai.map((p) => (

                <option
                  key={p._id}
                  value={p._id}
                >
                  {p.nama}
                </option>

              ))}

            </select>

          </div>

          {/* EMPTY */}
          {!loadingPegawai &&
            pegawai.length === 0 && (

            <div className="
              border rounded-2xl
              p-4
              text-sm
              text-gray-500
              bg-gray-50
            ">
              Tidak ada data pegawai
            </div>

          )}

          {/* LOADING */}
          {loadingPegawai && (

            <div className="
              border rounded-2xl
              p-4
              text-sm
              text-gray-500
              bg-gray-50
            ">
              Loading pegawai...
            </div>

          )}

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
            disabled={!selected || loading}
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
              disabled:cursor-not-allowed
            "
          >
            {loading
              ? "Menyimpan..."
              : "Simpan PIC"}
          </button>

        </div>

      </div>

    </div>
  );
}