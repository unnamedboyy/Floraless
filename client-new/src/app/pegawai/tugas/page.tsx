"use client";

import { useState } from "react";
import { useTickets } from "@/hooks/useTickets";
import Pagination from "@/components/table/Pagination";
import { updateStatusTicket } from "@/services/ticket.service";

export default function PegawaiTugasPage() {
  const [query, setQuery] = useState({
    page: 1,
    limit: 5,
    status: "",
    search: "",
  });

  const { data, total, reload } = useTickets(query);

  /* ================= ACTION ================= */

  const handleStatus = async (row: any) => {
    let nextStatus = "";

    if (row.status === "approved") nextStatus = "in_progress";
    if (row.status === "in_progress") nextStatus = "done";

    if (!nextStatus) return;

    await updateStatusTicket(row._id, nextStatus);
    reload();
  };

  /* ================= ACTION BUTTON ================= */

  const renderAction = (row: any) => {
    if (row.status === "approved") {
      return (
        <button
          onClick={() => handleStatus(row)}
          className="text-yellow-600"
        >
          Start
        </button>
      );
    }

    if (row.status === "in_progress") {
      return (
        <button
          onClick={() => handleStatus(row)}
          className="text-green-600"
        >
          Done
        </button>
      );
    }

    return "-";
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Tugas Saya</h1>

      {/* SEARCH + FILTER */}
      <div className="flex gap-2">
        <input
          placeholder="Cari pelanggan..."
          onChange={(e) =>
            setQuery({ ...query, search: e.target.value })
          }
          className="border p-2"
        />

        <select
          onChange={(e) =>
            setQuery({ ...query, status: e.target.value })
          }
          className="border p-2"
        >
          <option value="">Semua</option>
          <option value="approved">Approved</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {/* TABLE */}
      <table className="w-full border">
        <thead>
          <tr>
            <th>Pelanggan</th>
            <th>Layanan</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row: any) => (
            <tr key={row._id}>
              <td>{row.pelangganId?.nama}</td>
              <td>{row.layananId?.nama}</td>
              <td>{row.status}</td>
              <td>{renderAction(row)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <Pagination
        page={query.page}
        total={total}
        limit={query.limit}
        onChange={(p) => setQuery({ ...query, page: p })}
      />
    </div>
  );
}