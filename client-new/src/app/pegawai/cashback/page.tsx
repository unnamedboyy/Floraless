"use client";

import { useState } from "react";
import TableWrapper from "@/components/table/TableWrapper";
import { useCashback } from "@/hooks/useCashback";
import { processCashback } from "@/services/cashback.service";

export default function CashbackPage() {
  /* ================= DATA ================= */

  const { data = [], loading, reload } = useCashback();

  /* ================= STATE ================= */

  const [query, setQuery] = useState({
    page: 1,
    limit: data.length || 1, // 🔥 penting supaya tidak error pagination
    search: "",
  });

  /* ================= ACTION ================= */

  const handleApprove = async (id: string) => {
    await processCashback(id, {
      status: "approved",
      bukti_tf: "https://dummy.com/bukti.jpg",
    });

    reload();
  };

  const handleReject = async (id: string) => {
    const alasan = prompt("Alasan penolakan?");
    if (!alasan) return;

    await processCashback(id, {
      status: "rejected",
      alasan,
    });

    reload();
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-4">

      {/* HEADER */}
      <h1 className="text-xl font-semibold">
        Verifikasi Cashback
      </h1>

      {/* LOADING */}
      {loading ? (
        <div className="bg-white p-6 rounded-xl text-sm text-gray-500">
          Loading...
        </div>
      ) : (
        <TableWrapper
          data={data}
          total={data.length}
          query={query}
          setQuery={setQuery}

          columns={[
            { label: "Pelanggan", key: "pelangganId.nama" },
            { label: "Kode Voucher", key: "kode_voucher" },
            { label: "Bank", key: "bank" },
            { label: "Status", key: "status" },
          ]}

          actions={[
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
                {row.pelangganId?.nama || "-"}
              </p>

              <p className="text-sm text-gray-500">
                {row.kode_voucher}
              </p>

              <p className="text-sm">
                {row.bank}
              </p>

              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {row.status}
              </span>

            </div>
          )}
        />
      )}

    </div>
  );
}