"use client";

import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  data: any;
  onApprove: (id: string, bukti: string) => void;
  onReject: (id: string, alasan: string) => void;
};

export default function CashbackDetailModal({
  open,
  onClose,
  data,
  onApprove,
  onReject,
}: Props) {
  const [bukti, setBukti] = useState("");
  const [alasan, setAlasan] = useState("");

  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-[420px] space-y-3">

        <h2 className="font-bold">Detail Cashback</h2>

        <div className="text-sm space-y-1">
          <p><b>Pelanggan:</b> {data.pelangganId?.nama}</p>
          <p><b>Kode:</b> {data.kode_voucher}</p>
          <p><b>Bank:</b> {data.bank}</p>
          <p><b>No Rek:</b> {data.nomor_rekening}</p>
          <p><b>Status:</b> {data.status}</p>

          {data.bukti_tf && (
            <a
              href={data.bukti_tf}
              target="_blank"
              className="text-blue-500"
            >
              Lihat Bukti Transfer
            </a>
          )}

          {data.alasan && (
            <p className="text-red-500">
              Alasan: {data.alasan}
            </p>
          )}
        </div>

        {/* ACTION */}
        {data.status === "pending" && (
          <div className="space-y-2">

            <input
              placeholder="URL bukti transfer"
              className="border p-2 w-full"
              value={bukti}
              onChange={(e) => setBukti(e.target.value)}
            />

            <button
              onClick={() => onApprove(data._id, bukti)}
              className="bg-green-600 text-white w-full p-2"
            >
              Approve
            </button>

            <input
              placeholder="Alasan reject"
              className="border p-2 w-full"
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
            />

            <button
              onClick={() => onReject(data._id, alasan)}
              className="bg-red-600 text-white w-full p-2"
            >
              Reject
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="bg-black text-white w-full p-2"
        >
          Close
        </button>
      </div>
    </div>
  );
}