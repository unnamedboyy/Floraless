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

/* ================= BADGE ================= */

const getStatusBadge =
  (status: string) => {

    const map: any = {

      pending:
        "bg-gray-100 text-gray-700 border border-gray-200",

      approved:
        "bg-yellow-100 text-yellow-700 border border-yellow-200",

      in_progress:
        "bg-blue-100 text-blue-700 border border-blue-200",

      done:
        "bg-green-100 text-green-700 border border-green-200",
    };

    return (
      map[status] ||
      "bg-gray-100 text-gray-700 border"
    );
  };

export default function TicketPage() {

  /* ================= STATE ================= */

  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    status: "",
    search: "",
  });

  /* 🔥 VIEW */
  const [view, setView] =
    useState<"list" | "grid">(
      "list"
    );

  const [searchInput, setSearchInput] =
    useState("");

  const [selected, setSelected] =
    useState<any>(null);

  const [openAssign, setOpenAssign] =
    useState(false);

  const [detailId, setDetailId] =
    useState<string | null>(
      null
    );

  /* ================= DATA ================= */

  const {
    data = [],
    total = 0,
    reload,
  } = useTickets(query);

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

  const handleApprove =
    async (
      pegawaiId: string
    ) => {

      if (!pegawaiId)
        return alert(
          "Pilih pegawai dulu"
        );

      try {

        await approveTicket(
          selected._id,
          pegawaiId
        );

        setOpenAssign(false);
        setSelected(null);
        reload();

      } catch {

        alert(
          "Gagal assign PIC"
        );
      }
    };

  const handleStatus =
    async (row: any) => {

      let nextStatus = "";

      if (
        row.status ===
        "approved"
      ) {
        nextStatus =
          "in_progress";
      }

      if (
        row.status ===
        "in_progress"
      ) {
        nextStatus = "done";
      }

      if (!nextStatus) return;

      try {

        await updateStatusTicket(
          row._id,
          nextStatus
        );

        reload();

      } catch {

        alert(
          "Gagal update status"
        );
      }
    };

  /* ================= ACTION CONFIG ================= */

  const actions = [

    {
      label: "Detail",

      onClick: (row: any) =>
        setDetailId(row._id),
    },

    {
      label: "Action",

      onClick: (row: any) => {

        if (
          row.status ===
          "pending"
        ) {

          setSelected(row);

          setOpenAssign(true);

        } else {

          handleStatus(row);
        }
      },
    },

  ];

  /* ================= UI ================= */

  return (

    <div className="p-6 space-y-5">

      {/* HEADER */}
      <div>

        <h1 className="text-2xl font-bold">
          Kelola Ticket
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Monitoring ticket dan progress layanan
        </p>

      </div>

      {/* TABLE */}
      <TableWrapper

        /* 🔥 VIEW */
        view={view}
        setView={setView}

        /* 🔥 FILTER */
        filterContent={

          <div className="space-y-3">

            {/* STATUS */}
            <div>

              <p className="text-xs text-gray-500 mb-1">
                Status Ticket
              </p>

              <select
                value={query.status}
                onChange={(e) =>
                  setQuery((prev) => ({
                    ...prev,
                    status: e.target.value,
                    page: 1,
                  }))
                }
                className="
                  w-full
                  border
                  rounded-xl
                  px-3
                  py-2
                  text-sm
                "
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

                <option value="in_progress">
                  In Progress
                </option>

                <option value="done">
                  Done
                </option>

              </select>

            </div>

            {/* LIMIT */}
            <div>

              <p className="text-xs text-gray-500 mb-1">
                Data per halaman
              </p>

              <select
                value={query.limit}
                onChange={(e) =>
                  setQuery((prev) => ({
                    ...prev,
                    limit: Number(
                      e.target.value
                    ),
                    page: 1,
                  }))
                }
                className="
                  w-full
                  border
                  rounded-xl
                  px-3
                  py-2
                  text-sm
                "
              >

                <option value={5}>
                  5
                </option>

                <option value={10}>
                  10
                </option>

                <option value={20}>
                  20
                </option>

                <option value={50}>
                  50
                </option>

              </select>

            </div>

            {/* RESET */}
            <button
              onClick={() => {

                setSearchInput("");

                setQuery({
                  page: 1,
                  limit: 10,
                  status: "",
                  search: "",
                });
              }}
              className="
                w-full
                bg-black
                text-white
                rounded-xl
                py-2
                text-sm
              "
            >
              Reset Filter
            </button>

          </div>
        }

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
            label: "Layanan",
            key: "layananId.nama",
          },

          {
            label: "PIC",
            key: "pegawaiId.nama",
          },

          {
            label: "Status",
            key: "status",
          },

        ]}

        actions={actions}

        /* ================= GRID ================= */

        renderItem={(row) => (

          <div
            className="
              bg-white
              border
              rounded-3xl
              p-5
              space-y-4
              shadow-sm
            "
          >

            {/* TOP */}
            <div className="flex items-start justify-between gap-3">

              <div>

                <p className="font-semibold text-base">
                  {row.pelangganId?.nama ||
                    "-"}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {row.layananId?.nama ||
                    "-"}
                </p>

              </div>

              <span
                className={`
                  inline-flex
                  items-center
                  px-3
                  py-1
                  rounded-full
                  text-xs
                  font-medium
                  ${getStatusBadge(
                    row.status
                  )}
                `}
              >
                {row.status}
              </span>

            </div>

            {/* PIC */}
            <div>

              <p className="text-xs text-gray-400">
                PIC Pegawai
              </p>

              <p className="text-sm font-medium mt-1">
                {row.pegawaiId?.nama ||
                  "-"}
              </p>

            </div>

            {/* ACTION */}
            <div
              className="
                pt-3
                border-t
                flex
                flex-wrap
                gap-2
              "
            >

              <button
                onClick={() =>
                  setDetailId(
                    row._id
                  )
                }
                className="
                  px-3
                  py-1.5
                  rounded-xl
                  bg-gray-100
                  text-sm
                "
              >
                Detail
              </button>

              {row.status ===
                "pending" && (

                <button
                  onClick={() => {

                    setSelected(row);

                    setOpenAssign(
                      true
                    );
                  }}
                  className="
                    px-3
                    py-1.5
                    rounded-xl
                    bg-blue-100
                    text-blue-700
                    text-sm
                  "
                >
                  Assign
                </button>
              )}

              {row.status ===
                "approved" && (

                <button
                  onClick={() =>
                    handleStatus(
                      row
                    )
                  }
                  className="
                    px-3
                    py-1.5
                    rounded-xl
                    bg-yellow-100
                    text-yellow-700
                    text-sm
                  "
                >
                  Start
                </button>
              )}

              {row.status ===
                "in_progress" && (

                <button
                  onClick={() =>
                    handleStatus(
                      row
                    )
                  }
                  className="
                    px-3
                    py-1.5
                    rounded-xl
                    bg-green-100
                    text-green-700
                    text-sm
                  "
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
        onClose={() =>
          setOpenAssign(false)
        }
        onSubmit={handleApprove}
        ticket={selected}
      />

      <TicketDetailModal
        open={!!detailId}
        ticketId={detailId}
        onClose={() =>
          setDetailId(null)
        }
      />

    </div>
  );
}