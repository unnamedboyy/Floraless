"use client";

import { useEffect, useState } from "react";
import { useTickets } from "@/hooks/useTickets";
import TableWrapper from "@/components/table/TableWrapper";

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
  /* ================= STATE ================= */

  const [query, setQuery] = useState({
    page: 1,
    limit: 8,
    status: "",
    search: "",
  });

  const [searchInput, setSearchInput] = useState("");

  const { data = [], total = 0, reload } = useTickets(query);

  const [selected, setSelected] = useState<any>(null);
  const [openAssign, setOpenAssign] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);

  /* ================= DEBOUNCE SEARCH ================= */
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery((q) => ({
        ...q,
        search: searchInput,
        page: 1,
      }));
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
    } catch {
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

  /* ================= ACTION CONFIG ================= */

  const actions = [
    {
      label: "Detail",
      onClick: (row: any) => setDetailId(row._id),
    },
  ];

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-4">

      <h1 className="text-xl font-semibold">
        Kelola Ticket
      </h1>

      {/* ================= FILTER ================= */}
      {/* <div className="flex gap-2">
        <input
          placeholder="Cari pelanggan, layanan, PIC..."
          className="border p-2 w-[300px]"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

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
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div> */}

      {/* ================= TABLE SYSTEM ================= */}
      <TableWrapper
        data={data}
        total={total}
        query={query}
        setQuery={setQuery}

        columns={[
          { label: "Pelanggan", key: "pelangganId.nama" },
          { label: "Layanan", key: "layananId.nama" },
          { label: "PIC", key: "pegawaiId.nama" },
          { label: "Status", key: "status" },
        ]}

        actions={[
          ...actions,
          {
            label: "Action",
            onClick: (row: any) => {
              if (row.status === "pending") {
                setSelected(row);
                setOpenAssign(true);
              } else {
                handleStatus(row);
              }
            },
          },
        ]}

        renderItem={(row) => (
          <div className="bg-white border rounded-xl p-4 space-y-2">
            <p className="font-semibold">
              {row.pelangganId?.nama}
            </p>

            <p className="text-sm text-gray-500">
              {row.layananId?.nama}
            </p>

            <p className="text-sm">
              PIC: {row.pegawaiId?.nama || "-"}
            </p>

            <span
              className={`text-xs px-2 py-1 rounded ${getStatusBadge(
                row.status
              )}`}
            >
              {row.status}
            </span>

            <div className="flex gap-2 text-sm mt-2">
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
                  Assign
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
          </div>
        )}
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