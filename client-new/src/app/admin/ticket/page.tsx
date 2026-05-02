"use client";

import { useEffect, useState } from "react";
import { useTickets } from "@/hooks/useTickets";
import Pagination from "@/components/table/Pagination";
import AssignPICModal from "@/components/modal/AssignPICModal";
import TicketDetailModal from "@/components/modal/TicketDetailModal";

import {
  approveTicket,
  updateStatusTicket,
} from "@/services/ticket.service";

/* ================= HELPER ================= */
const getStatusBadge = (status: string) => {
  const map: any = {
    pending: "bg-gray-200 text-gray-700",
    approved: "bg-yellow-200 text-yellow-800",
    in_progress: "bg-blue-200 text-blue-800",
    done: "bg-green-200 text-green-800",
  };

  return map[status] || "bg-gray-100";
};

export default function TicketPage() {
  const [query, setQuery] = useState({
    page: 1,
    limit: 5,
    status: "",
    search: "",
  });

  const [searchInput, setSearchInput] = useState("");

  const { data, total, reload } = useTickets(query);

  const [selected, setSelected] = useState<any>(null);
  const [openAssign, setOpenAssign] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);

  /* ================= DEBOUNCE SEARCH ================= */
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery((q) => ({ ...q, search: searchInput, page: 1 }));
    }, 400);

    return () => clearTimeout(t);
  }, [searchInput]);

  /* ================= ACTION ================= */

  const handleApprove = async (pegawaiId: string) => {
    if (!pegawaiId) return alert("Pilih pegawai dulu");

    try {
      await approveTicket(selected._id, pegawaiId);
      setOpenAssign(false);
      setSelected(null);
      reload();
    } catch (err) {
      alert("Gagal assign PIC");
    }
  };

  const handleStatus = async (row: any) => {
    let nextStatus = "";

    if (row.status === "approved") nextStatus = "in_progress";
    if (row.status === "in_progress") nextStatus = "done";

    if (!nextStatus) return;

    try {
      await updateStatusTicket(row._id, nextStatus);
      reload();
    } catch {
      alert("Gagal update status");
    }
  };

  /* ================= ACTION RENDER ================= */

  const renderAction = (row: any) => {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => setDetailId(row._id)}
          className="text-green-600"
        >
          Detail
        </button>

        {row.status === "pending" && (
          <button
            onClick={() => {
              setSelected(row);
              setOpenAssign(true);
            }}
            className="text-blue-500"
          >
            Assign + ACC
          </button>
        )}

        {row.status === "approved" && (
          <button
            onClick={() => handleStatus(row)}
            className="text-yellow-600"
          >
            Start
          </button>
        )}

        {row.status === "in_progress" && (
          <button
            onClick={() => handleStatus(row)}
            className="text-green-700"
          >
            Done
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Kelola Ticket</h1>

      {/* ================= FILTER + SEARCH ================= */}
      <div className="flex gap-2">
        <input
          placeholder="Cari pelanggan, layanan, PIC..."
          className="border p-2 w-[300px]"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <select
          value={query.status}
          onChange={(e) =>
            setQuery({ ...query, status: e.target.value, page: 1 })
          }
          className="border p-2"
        >
          <option value="">Semua</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {/* ================= TABLE ================= */}
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Pelanggan</th>
            <th className="p-2">Layanan</th>
            <th className="p-2">PIC</th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row._id} className="border-t">
              <td className="p-2">{row.pelangganId?.nama}</td>
              <td className="p-2">{row.layananId?.nama}</td>
              <td className="p-2">{row.pegawaiId?.nama || "-"}</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded text-xs ${getStatusBadge(
                    row.status
                  )}`}
                >
                  {row.status}
                </span>
              </td>
              <td className="p-2">{renderAction(row)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= PAGINATION ================= */}
      <Pagination
        page={query.page}
        total={total}
        limit={query.limit}
        onChange={(p) => setQuery({ ...query, page: p })}
      />

      {/* ================= MODALS ================= */}
      <AssignPICModal
        open={openAssign}
        onClose={() => setOpenAssign(false)}
        onSubmit={handleApprove}
      />

      <TicketDetailModal
        open={!!detailId}
        ticketId={detailId}
        onClose={() => setDetailId(null)}
      />
    </div>
  );
}