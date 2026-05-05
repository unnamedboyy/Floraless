"use client";

import { useState } from "react";
import TableWrapper from "@/components/table/TableWrapper";
import { usePayment } from "@/hooks/usePayment";
import {
  approvePayment,
  rejectPayment,
} from "@/services/payment.service";
import PaymentDetailModal from "@/components/modal/PaymentDetailModal";

export default function PaymentPage() {
  /* ================= STATE ================= */

  const [query, setQuery] = useState({
    page: 1,
    limit: 5,
    status: "",
    search: "",
  });

  const { data = [], total = 0, reload } = usePayment(query);

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

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-4">

      {/* HEADER */}
      <h1 className="text-xl font-semibold">
        Kelola Pembayaran
      </h1>

      {/* FILTER STATUS */}
      <div className="flex gap-3">
        <select
          value={query.status}
          onChange={(e) =>
            setQuery({
              ...query,
              status: e.target.value,
              page: 1,
            })
          }
          className="border px-3 py-2 rounded-xl text-sm"
        >
          <option value="">Semua</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* TABLE SYSTEM */}
      <TableWrapper
        data={data}
        total={total}
        query={query}
        setQuery={setQuery}

        columns={[
          { label: "Pelanggan", key: "ticketId.pelangganId.nama" },
          { label: "Tipe", key: "tipe" },
          { label: "Jumlah", key: "jumlah" },
          { label: "Status", key: "status" },
          { label: "Tanggal", key: "createdAt" },
        ]}

        actions={[
          {
            label: "Detail",
            onClick: (row) => setSelected(row),
          },
          {
            label: "Approve",
            show: (row) => row.status === "pending",
            onClick: (row) => handleApprove(row._id),
          },
          {
            label: "Reject",
            show: (row) => row.status === "pending",
            onClick: (row) => handleReject(row._id),
          },
        ]}

        /* GRID VIEW */
        renderItem={(row) => (
          <div className="bg-white border rounded-xl p-4 space-y-2">

            <p className="font-semibold">
              {row.ticketId?.pelangganId?.nama || "-"}
            </p>

            <p className="text-sm text-gray-500">
              {row.tipe}
            </p>

            <p className="text-sm font-medium">
              Rp {row.jumlah?.toLocaleString()}
            </p>

            <span
              className={`inline-block px-2 py-1 rounded text-xs ${getStatusBadge(
                row.status
              )}`}
            >
              {row.status}
            </span>

            <p className="text-xs text-gray-400">
              {row.createdAt
                ? new Date(row.createdAt).toLocaleString()
                : "-"}
            </p>
          </div>
        )}
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