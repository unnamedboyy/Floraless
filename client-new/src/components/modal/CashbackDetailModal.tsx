"use client";

import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  data: any;
  onApprove: (
    id: string,
    bukti: string
  ) => void;

  onReject: (
    id: string,
    alasan: string
  ) => void;
};

export default function CashbackDetailModal({
  open,
  onClose,
  data,
  onApprove,
  onReject,
}: Props) {

  const [bukti, setBukti] =
    useState("");

  const [alasan, setAlasan] =
    useState("");

  const [loadingApprove, setLoadingApprove] =
    useState(false);

  const [loadingReject, setLoadingReject] =
    useState(false);

  if (!open || !data) return null;

  const statusClass =
    data.status === "approved"
      ? "bg-green-100 text-green-700 border-green-200"
      : data.status === "rejected"
      ? "bg-red-100 text-red-700 border-red-200"
      : "bg-yellow-100 text-yellow-700 border-yellow-200";

  const handleApprove = async () => {

    try {

      setLoadingApprove(true);

      await onApprove(
        data._id,
        bukti
      );

    } finally {

      setLoadingApprove(false);

    }
  };

  const handleReject = async () => {

    try {

      setLoadingReject(true);

      await onReject(
        data._id,
        alasan
      );

    } finally {

      setLoadingReject(false);

    }
  };

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
              Detail Cashback
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Informasi lengkap klaim cashback
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

          {/* STATUS */}
          <div className="flex items-center justify-between">

            <div>
              <div className="text-sm text-gray-500">
                Status Klaim
              </div>

              <div className="
                mt-2
                inline-flex
                px-4 py-2
                rounded-full
                border
                text-sm
                font-medium
              ">
                <span className={statusClass}>
                  {data.status}
                </span>
              </div>
            </div>

          </div>

          {/* INFO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Field
              label="Pelanggan"
              value={
                data.pelangganId?.nama
              }
            />

            <Field
              label="Kode Voucher"
              value={data.kode_voucher}
            />

            <Field
              label="Bank"
              value={data.bank}
            />

            <Field
              label="No Rekening"
              value={
                data.nomor_rekening
              }
            />

            <Field
              label="Nama Rekening"
              value={
                data.nama_rekening
              }
            />

            <Field
              label="Tanggal Klaim"
              value={
                data.createdAt
                  ? new Date(
                      data.createdAt
                    ).toLocaleString()
                  : "-"
              }
            />

          </div>

          {/* BUKTI */}
          {data.bukti_tf && (

            <div className="
              border rounded-2xl p-4
              bg-gray-50/70
            ">

              <div className="text-sm font-medium mb-3">
                Bukti Transfer
              </div>

              <a
                href={data.bukti_tf}
                target="_blank"
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-4 py-2
                  rounded-xl
                  bg-black
                  text-white
                  text-sm
                  hover:opacity-90
                  transition
                "
              >
                Lihat Bukti
              </a>

            </div>

          )}

          {/* ALASAN */}
          {data.alasan && (

            <div className="
              border border-red-200
              bg-red-50
              rounded-2xl
              p-4
            ">

              <div className="text-sm font-medium text-red-700 mb-2">
                Alasan Penolakan
              </div>

              <div className="text-sm text-red-600">
                {data.alasan}
              </div>

            </div>

          )}

          {/* ACTION */}
          {data.status === "pending" && (

            <div className="space-y-5">

              {/* APPROVE */}
              <div className="
                border rounded-2xl p-5
                space-y-4
              ">

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Approve Cashback
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Masukkan bukti transfer untuk approval
                  </p>
                </div>

                <input
                  placeholder="URL bukti transfer"
                  value={bukti}
                  onChange={(e) =>
                    setBukti(
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
                />

                <button
                  onClick={handleApprove}
                  disabled={loadingApprove}
                  className="
                    w-full
                    py-3
                    rounded-2xl
                    bg-green-600
                    text-white
                    hover:bg-green-700
                    transition
                    text-sm
                    font-medium
                    disabled:opacity-50
                  "
                >
                  {loadingApprove
                    ? "Processing..."
                    : "Approve Cashback"}
                </button>

              </div>

              {/* REJECT */}
              <div className="
                border rounded-2xl p-5
                space-y-4
              ">

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Reject Cashback
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Berikan alasan penolakan klaim
                  </p>
                </div>

                <textarea
                  placeholder="Masukkan alasan reject..."
                  value={alasan}
                  onChange={(e) =>
                    setAlasan(
                      e.target.value
                    )
                  }
                  rows={4}
                  className="
                    w-full
                    rounded-2xl
                    border
                    px-4 py-3
                    text-sm
                    resize-none
                    focus:outline-none
                    focus:ring-2
                    focus:ring-black
                  "
                />

                <button
                  onClick={handleReject}
                  disabled={loadingReject}
                  className="
                    w-full
                    py-3
                    rounded-2xl
                    bg-red-600
                    text-white
                    hover:bg-red-700
                    transition
                    text-sm
                    font-medium
                    disabled:opacity-50
                  "
                >
                  {loadingReject
                    ? "Processing..."
                    : "Reject Cashback"}
                </button>

              </div>

            </div>

          )}

        </div>

        {/* FOOTER */}
        <div className="border-t px-6 py-4 flex justify-end">

          <button
            onClick={onClose}
            className="
              px-5 py-2.5
              rounded-2xl
              bg-black
              text-white
              hover:opacity-90
              transition
              text-sm
              font-medium
            "
          >
            Tutup
          </button>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  value,
}: {
  label: string;
  value?: any;
}) {

  return (
    <div className="
      border rounded-2xl p-4
      bg-gray-50/70
      space-y-1
    ">

      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </div>

      <div className="text-sm font-semibold text-gray-900 break-words">
        {value || "-"}
      </div>

    </div>
  );
}