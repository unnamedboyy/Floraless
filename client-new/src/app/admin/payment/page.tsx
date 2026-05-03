"use client";

import { useState } from "react";
import { usePayment } from "@/hooks/usePayment";
import {
  approvePayment,
  rejectPayment,
} from "@/services/payment.service";
import PaymentDetailModal from "@/components/modal/PaymentDetailModal";
import Pagination from "@/components/table/Pagination";

export default function PaymentPage() {
  const [query, setQuery] = useState({
    page: 1,
    limit: 5,
    status: "",
  });

  const { data, total, reload } = usePayment(query);

  const [selected, setSelected] = useState<any>(null);

  /* ================= ACTION ================= */

  const handleApprove = async (id: string) => {
    try {
      await approvePayment(id);
      reload();
    } catch {
      alert("Gagal approve");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectPayment(id);
      reload();
    } catch {
      alert("Gagal reject");
    }
  };

  const getStatusBadge = (status: string) => {
    const map: any = {
      pending: "bg-gray-200 text-gray-700",
      approved: "bg-green-200 text-green-800",
      rejected: "bg-red-200 text-red-800",
    };

    return map[status] || "bg-gray-100";
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Kelola Pembayaran</h1>

      {/* FILTER */}
      <select
        value={query.status}
        onChange={(e) =>
          setQuery({
            ...query,
            status: e.target.value,
            page: 1,
          })
        }
        className="border p-2"
      >
        <option value="">Semua</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>

      {/* TABLE */}
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Pelanggan</th>
            <th className="p-2">Tipe</th>
            <th className="p-2">Jumlah</th>
            <th className="p-2">Status</th>
            <th className="p-2">Tanggal</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row._id} className="border-t">

              <td className="p-2">
                {row.ticketId?.pelangganId?.nama || "-"}
              </td>

              <td className="p-2">{row.tipe}</td>

              <td className="p-2">
                Rp {row.jumlah?.toLocaleString()}
              </td>

              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded text-xs ${getStatusBadge(
                    row.status
                  )}`}
                >
                  {row.status}
                </span>
              </td>

              <td className="p-2">
                {new Date(row.createdAt).toLocaleString()}
              </td>

              <td className="p-2 space-x-2">

                <button
                  onClick={() => setSelected(row)}
                  className="text-green-600"
                >
                  Detail
                </button>

                {row.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleApprove(row._id)}
                      className="text-blue-500"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleReject(row._id)}
                      className="text-red-500"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <Pagination
        page={query.page}
        total={total}
        limit={query.limit}
        onChange={(p) =>
          setQuery({ ...query, page: p })
        }
      />

      {/* MODAL */}
      <PaymentDetailModal
        open={!!selected}
        data={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}