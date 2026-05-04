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
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    if (open && data) {
      const ticketId = data?.ticketId?._id || data?.ticketId;

      if (ticketId) {
        fetchPayments(ticketId);
      }
    }
  }, [open, data]);

  const fetchPayments = async (ticketId: string) => {
    try {
      const res = await api.get(`/payments/ticket/${ticketId}`);
      setPayments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!open || !data) return null;

  /* ================= SUMMARY ================= */

  const total = payments.reduce((s, p) => s + p.jumlah, 0);
  const approved = payments
    .filter((p) => p.status === "approved")
    .reduce((s, p) => s + p.jumlah, 0);

  const sisa = total - approved;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-[500px] max-h-[90vh] overflow-y-auto space-y-4">

        <h2 className="text-lg font-bold">
          Detail Pembayaran
        </h2>

        {/* ================= INFO ================= */}
        <div className="text-sm space-y-1">
          <p>
            <b>Pelanggan:</b>{" "}
            {data.ticketId?.pelangganId?.nama || "-"}
          </p>
          <p>
            <b>Ticket ID:</b>{" "}
            {data.ticketId?._id || data.ticketId}
          </p>
        </div>

        <hr />

        {/* ================= LIST PAYMENT ================= */}
        <div>
          <h3 className="font-semibold mb-2">
            Riwayat Pembayaran
          </h3>

          {payments.length === 0 && (
            <p className="text-sm text-gray-500">
              Belum ada pembayaran
            </p>
          )}

          {payments.map((p) => (
            <div
              key={p._id}
              className={`border p-3 rounded mb-2 ${
                p._id === data._id
                  ? "border-blue-500 bg-blue-50"
                  : ""
              }`}
            >
              <div className="flex justify-between">
                <p><b>{p.tipe}</b></p>

                <span
                  className={`text-xs px-2 py-1 rounded ${
                    p.status === "approved"
                      ? "bg-green-200"
                      : p.status === "rejected"
                      ? "bg-red-200"
                      : "bg-gray-200"
                  }`}
                >
                  {p.status}
                </span>
              </div>

              <p className="text-sm">
                {formatRupiah(p.jumlah)}
              </p>

              <p className="text-xs text-gray-500">
                {new Date(p.createdAt).toLocaleString()}
              </p>

              {p.catatan && (
                <p className="text-xs italic mt-1">
                  Catatan: {p.catatan}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* ================= SUMMARY ================= */}
        <div className="border p-3 rounded bg-gray-50">
          <p><b>Total:</b> {formatRupiah(total)}</p>
          <p><b>Approved:</b> {formatRupiah(approved)}</p>
          <p><b>Sisa:</b> {formatRupiah(sisa)}</p>
        </div>

        {/* ================= CLOSE ================= */}
        <button
          onClick={onClose}
          className="bg-black text-white px-4 py-2 w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
}