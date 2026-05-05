"use client";

import { useState } from "react";
import TableWrapper from "@/components/table/TableWrapper";
import { useTickets } from "@/hooks/useTickets";
import { updateStatusTicket } from "@/services/ticket.service";

export default function PegawaiTugasPage() {
  /* ================= STATE ================= */

  const [query, setQuery] = useState({
    page: 1,
    limit: 5,
    status: "",
    search: "",
  });

  const { data = [], total = 0, reload } = useTickets(query);

  /* ================= ACTION ================= */

  const handleStatus = async (row: any) => {
    let nextStatus = "";

    if (row.status === "approved") nextStatus = "in_progress";
    if (row.status === "in_progress") nextStatus = "done";

    if (!nextStatus) return;

    await updateStatusTicket(row._id, nextStatus);
    reload();
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-4">

      {/* HEADER */}
      <h1 className="text-xl font-semibold">
        Tugas Saya
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
          <option value="">Semua</option>
          <option value="approved">Approved</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {/* TABLE SYSTEM */}
      <TableWrapper
        data={data}
        total={total}
        query={query}
        setQuery={setQuery}

        columns={[
          { label: "Pelanggan", key: "pelangganId.nama" },
          { label: "Layanan", key: "layananId.nama" },
          { label: "Status", key: "status" },
        ]}

        actions={[
          {
            label: "Start",
            show: (row) => row.status === "approved",
            onClick: handleStatus,
          },
          {
            label: "Done",
            show: (row) => row.status === "in_progress",
            onClick: handleStatus,
          },
        ]}

        /* GRID VIEW */
        renderItem={(row) => (
          <div className="bg-white border rounded-xl p-4 space-y-2">

            <p className="font-semibold">
              {row.pelangganId?.nama || "-"}
            </p>

            <p className="text-sm text-gray-500">
              {row.layananId?.nama || "-"}
            </p>

            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              {row.status}
            </span>

          </div>
        )}
      />

    </div>
  );
}