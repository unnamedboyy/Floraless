"use client";

import { useState } from "react";
import TableWrapper from "@/components/table/TableWrapper";

import { useCashback } from "@/hooks/useCashback";

import {
  approveCashback,
  rejectCashback,
} from "@/services/cashback.service";

import CashbackDetailModal from "@/components/modal/CashbackDetailModal";

export default function CashbackPage() {

  /* ================= STATE ================= */

  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    status: "",
    search: "",
  });

  const {
    data = [],
    total = 0,
    reload,
  } = useCashback(query);

  const [selected, setSelected] =
    useState<any>(null);

  /* ================= ACTION ================= */

  const handleApprove = async (
    id: string,
    bukti: string
  ) => {

    if (!bukti)
      return alert("Bukti wajib diisi");

    await approveCashback(id, bukti);

    reload();
    setSelected(null);
  };

  const handleReject = async (
    id: string,
    alasan: string
  ) => {

    if (!alasan)
      return alert("Alasan wajib diisi");

    await rejectCashback(id, alasan);

    reload();
    setSelected(null);
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-4">

      {/* HEADER */}
      <h1 className="text-xl font-semibold">
        Cashback Claim
      </h1>

      {/* FILTER */}
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
          <option value="">
            Semua
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="approved">
            Approved
          </option>

          <option value="rejected">
            Rejected
          </option>

        </select>

      </div>

      {/* TABLE */}
      <TableWrapper
        data={data}
        total={total}

        query={query}
        setQuery={setQuery}

        columns={[
          {
            label: "Pelanggan",
            key: "pelangganId.nama",
          },

          {
            label: "Kode",
            key: "kode_voucher",
          },

          {
            label: "Bank",
            key: "bank",
          },

          {
            label: "Status",
            key: "status",
          },
        ]}

        actions={[
          {
            label: "Detail",
            onClick: (row) =>
              setSelected(row),
          },
        ]}

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

      {/* MODAL */}
      <CashbackDetailModal
        open={!!selected}
        data={selected}
        onClose={() => setSelected(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />

    </div>
  );
}