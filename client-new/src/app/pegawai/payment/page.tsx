"use client";

import { useState } from "react";
import { usePayment } from "@/hooks/usePayment";
import {
  approvePayment,
  rejectPayment,
} from "@/services/payment.service";
import PaymentDetailModal from "@/components/modal/PaymentDetailModal";

export default function PaymentPage() {
  const [query, setQuery] = useState({
    page: 1,
    limit: 5,
    status: "pending",
  });

  const { data, total, reload } = usePayment(query);

  const [selected, setSelected] = useState<any>(null);
  const [openDetail, setOpenDetail] = useState(false);

  /* ================= ACTION ================= */

  const handleApprove = async (id: string) => {
    await approvePayment(id);
    reload();
  };

  const handleReject = async (id: string) => {
    await rejectPayment(id);
    reload();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">
        Verifikasi Pembayaran
      </h1>

      {/* TABLE */}
      <table className="w-full border">
        <thead>
          <tr>
            <th>Pelanggan</th>
            <th>Tipe</th>
            <th>Jumlah</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row: any) => (
            <tr key={row._id}>
              <td>{row.ticketId?.pelangganId?.nama}</td>
              <td>{row.tipe}</td>
              <td>Rp {row.jumlah.toLocaleString()}</td>
              <td>{row.status}</td>

              <td className="space-x-2">
                {/* DETAIL */}
                <button
                  onClick={() => {
                    setSelected(row);
                    setOpenDetail(true);
                  }}
                  className="text-blue-500"
                >
                  Detail
                </button>

                {/* APPROVE */}
                <button
                  onClick={() => handleApprove(row._id)}
                  className="text-green-600"
                >
                  Approve
                </button>

                {/* REJECT */}
                <button
                  onClick={() => handleReject(row._id)}
                  className="text-red-600"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      <PaymentDetailModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        data={selected}
      />
    </div>
  );
}