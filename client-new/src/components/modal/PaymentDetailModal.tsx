"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

type Props = {
  open: boolean;
  onClose: () => void;
  data: any;
};

const formatRupiah = (num: number) =>
  "Rp " + (num || 0).toLocaleString("id-ID");

export default function PaymentDetailModal({
  open,
  onClose,
  data,
}: Props) {

  const [payments, setPayments] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    if (open && data) {

      const ticketId =
        data?.ticketId?._id ||
        data?.ticketId;

      if (ticketId) {
        fetchPayments(ticketId);
      }
    }

  }, [open, data]);

  const fetchPayments = async (
    ticketId: string
  ) => {

    try {

      setLoading(true);

      const res = await api.get(
        `/payments/ticket/${ticketId}`
      );

      setPayments(res.data || []);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  if (!open || !data) return null;

  /* ================= SUMMARY ================= */

  const total = payments.reduce(
    (s, p) => s + p.jumlah,
    0
  );

  const approved = payments
    .filter(
      (p) =>
        p.status === "approved"
    )
    .reduce(
      (s, p) => s + p.jumlah,
      0
    );

  const sisa = total - approved;

  const progress =
    total > 0
      ? Math.min(
          (approved / total) * 100,
          100
        )
      : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

      {/* CARD */}
      <div className="
        w-full
        max-w-4xl
        bg-white
        rounded-3xl
        shadow-2xl
        overflow-hidden
        animate-in fade-in zoom-in-95 duration-200
        max-h-[90vh]
        flex
        flex-col
      ">

        {/* HEADER */}
        <div className="px-6 py-5 border-b flex items-start justify-between">

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Detail Pembayaran
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Riwayat dan progress pembayaran ticket
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

        {/* CONTENT */}
        <div className="
          flex-1
          overflow-y-auto
          p-6
          space-y-6
        ">

          {/* INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Field
              label="Pelanggan"
              value={
                data.ticketId
                  ?.pelangganId?.nama
              }
            />

            <Field
              label="Ticket ID"
              value={
                data.ticketId?._id ||
                data.ticketId
              }
            />

          </div>

          {/* SUMMARY */}
          <div className="
            border rounded-3xl
            p-6
            bg-gray-50/70
            space-y-5
          ">

            <div className="flex items-center justify-between">

              <div>
                <div className="text-sm text-gray-500">
                  Progress Pembayaran
                </div>

                <div className="text-2xl font-bold text-black mt-1">
                  {progress.toFixed(0)}%
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-500">
                  Approved
                </div>

                <div className="text-xl font-semibold">
                  {formatRupiah(
                    approved
                  )}
                </div>
              </div>

            </div>

            {/* PROGRESS */}
            <div className="
              w-full
              h-4
              bg-gray-200
              rounded-full
              overflow-hidden
            ">

              <div
                style={{
                  width: `${progress}%`,
                }}
                className="
                  h-full
                  bg-black
                  rounded-full
                  transition-all
                  duration-500
                "
              />

            </div>

            {/* SUMMARY GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <SummaryCard
                label="Total"
                value={formatRupiah(
                  total
                )}
              />

              <SummaryCard
                label="Approved"
                value={formatRupiah(
                  approved
                )}
              />

              <SummaryCard
                label="Sisa"
                value={formatRupiah(
                  sisa
                )}
              />

            </div>

          </div>

          {/* LIST */}
          <div className="space-y-4">

            <div className="flex items-center justify-between">

              <h3 className="text-lg font-semibold text-gray-900">
                Riwayat Pembayaran
              </h3>

              <div className="text-sm text-gray-500">
                {payments.length} pembayaran
              </div>

            </div>

            {/* EMPTY */}
            {!loading &&
              payments.length === 0 && (

              <div className="
                border rounded-2xl
                p-6
                text-sm
                text-gray-500
                bg-gray-50
              ">
                Belum ada pembayaran
              </div>

            )}

            {/* LOADING */}
            {loading && (

              <div className="
                border rounded-2xl
                p-6
                text-sm
                text-gray-500
                bg-gray-50
              ">
                Loading pembayaran...
              </div>

            )}

            {/* PAYMENT LIST */}
            <div className="space-y-3">

              {payments.map((p) => {

                const statusClass =
                  p.status === "approved"
                    ? "bg-green-100 text-green-700 border-green-200"
                    : p.status ===
                      "rejected"
                    ? "bg-red-100 text-red-700 border-red-200"
                    : "bg-yellow-100 text-yellow-700 border-yellow-200";

                return (
                  <div
                    key={p._id}
                    className={`
                      border rounded-2xl p-5
                      transition
                      ${
                        p._id === data._id
                          ? "border-black bg-gray-50"
                          : "hover:bg-gray-50"
                      }
                    `}
                  >

                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                      <div className="space-y-2">

                        <div className="flex items-center gap-3">

                          <div className="font-semibold text-gray-900">
                            {p.tipe}
                          </div>

                          <span
                            className={`
                              px-3 py-1
                              rounded-full
                              border
                              text-xs
                              font-medium
                              ${statusClass}
                            `}
                          >
                            {p.status}
                          </span>

                        </div>

                        <div className="text-2xl font-bold text-black">
                          {formatRupiah(
                            p.jumlah
                          )}
                        </div>

                        <div className="text-sm text-gray-500">
                          {new Date(
                            p.createdAt
                          ).toLocaleString()}
                        </div>

                        {p.catatan && (

                          <div className="
                            mt-2
                            border rounded-xl
                            p-3
                            bg-gray-50
                          ">

                            <div className="text-xs text-gray-500 mb-1">
                              Catatan
                            </div>

                            <div className="text-sm text-gray-700">
                              {p.catatan}
                            </div>

                          </div>

                        )}

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

          </div>

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

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {

  return (
    <div className="
      border rounded-2xl
      p-4
      bg-white
      space-y-1
    ">

      <div className="text-xs text-gray-500 uppercase tracking-wide">
        {label}
      </div>

      <div className="text-lg font-semibold text-black">
        {value}
      </div>

    </div>
  );
}