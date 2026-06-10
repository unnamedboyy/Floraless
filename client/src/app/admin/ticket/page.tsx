"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  Eye,
  UserPlus,
  Play,
  CheckCircle2,
  XCircle,
  FileText,
} from "lucide-react";

import TableWrapper
from "@/components/table/TableWrapper";

import AssignPICModal
from "@/components/modal/AssignPICModal";

import TicketDetailModal
from "@/components/modal/TicketDetailModal";

import {
  useTickets,
} from "@/hooks/useTickets";

import {
  approveTicket,
  updateStatusTicket,
} from "@/services/ticket.service";

import AddLogActivityModal from "@/components/modal/AddLogActivityModal";

/* =====================================================
   BADGE
===================================================== */

const getStatusBadge =
  (status: string) => {

    const map: any = {

      pending:
        "bg-gray-100 text-gray-700 border border-gray-200",

      approved:
        "bg-yellow-100 text-yellow-700 border border-yellow-200",

      in_progress:
        "bg-blue-100 text-blue-700 border border-blue-200",

      rejected:
        "bg-red-100 text-red-700 border border-red-200",

      done:
        "bg-green-100 text-green-700 border border-green-200",
    };

    return (

      map[status] ||

      "bg-gray-100 text-gray-700 border"
    );
  };

export default function TicketPage() {

  /* =====================================================
     STATE
  ===================================================== */

  const [query, setQuery] =
    useState({

      page: 1,
      limit: 10,
      status: "",
      search: "",
    });

  const [view, setView] =
    useState<"list" | "grid">(
      "list"
    );

  const [selected, setSelected] =
    useState<any>(null);

  const [openAssign, setOpenAssign] =
    useState(false);

  const [detailId, setDetailId] =
    useState<string | null>(
      null
    );

  const [openLog, setOpenLog] =
    useState(false);

  /* =====================================================
     DATA
  ===================================================== */

  const {

    data = [],

    total = 0,

    reload,

  } = useTickets(query);

  /* =====================================================
     APPROVE
  ===================================================== */

  const handleApprove =
    async (
      pegawaiId: string
    ) => {

      if (!pegawaiId) {

        toast.error(
          "Pilih pegawai dulu"
        );

        return;
      }

      try {

        await approveTicket(

          selected._id,

          pegawaiId
        );

        toast.success(
          "PIC berhasil ditugaskan"
        );

        setOpenAssign(false);
        setSelected(null);
        reload();

      } catch (err: any) {

        console.error(err);

        toast.error(

          err?.response?.data?.message ||

          "Gagal assign PIC"
        );
      }
    };

  /* =====================================================
     UPDATE STATUS
  ===================================================== */

  const handleStatus = async (row: any) => {

    let nextStatus = "";

    if (row.status === "approved") {
      nextStatus = "in_progress";
    }

    if (row.status === "in_progress") {
      nextStatus = "done";
    }

    if (!nextStatus) return;

    toast((t) => (

      <div className="w-[300px]">

        {/* TITLE */}
        <p className="font-semibold text-sm">
          Update Status?
        </p>

        {/* DESC */}
        <p className="text-sm text-gray-500 mt-1">
          Status akan diubah menjadi{" "}
          <span className="font-medium">
            {nextStatus.replace("_", " ")}
          </span>
        </p>

        {/* ACTION */}
        <div className="flex justify-end gap-2 mt-4">

          <button
            onClick={() =>
              toast.dismiss(t.id)
            }
            className="
              px-3
              py-2
              rounded-xl
              border
              text-sm
              hover:bg-gray-50
            "
          >
            Batal
          </button>

          <button
            onClick={async () => {

              toast.dismiss(t.id);

              try {

                await updateStatusTicket(
                  row._id,
                  nextStatus
                );

                toast.success(
                  "Status ticket berhasil diperbarui"
                );

                reload();

              } catch (err: any) {

                console.error(err);

                toast.error(
                  err?.response?.data?.message ||
                  "Gagal update status"
                );
              }

            }}
            className="
              px-3
              py-2
              rounded-xl
              bg-black
              text-white
              text-sm
              hover:bg-gray-800
            "
          >
            Update
          </button>

        </div>

      </div>

    ), {
      duration: 10000,
    });

  };
  
  /* =====================================================
     ACTIONS
  ===================================================== */

  const actions = [

    /* ================= DETAIL ================= */

    {
      icon: (
        <Eye size={17} />
      ),

      className: `
        bg-gray-100
        text-gray-700
        hover:bg-gray-200
      `,

      onClick: (row: any) =>
        setDetailId(row._id),
    },

    {
      icon: (
        <FileText size={17} />
      ),

      className: `
        bg-indigo-100
        text-indigo-700
        hover:bg-indigo-200
      `,

      show: (row: any) =>
        row.status !== "done" &&
        row.status !== "rejected",

      onClick: (row: any) => {

        setSelected(row);

        setOpenLog(true);
      },
    },

    /* ================= ASSIGN ================= */

    {
      icon: (
        <UserPlus size={17} />
      ),

      className: `
        bg-blue-100
        text-blue-700
        hover:bg-blue-200
      `,

      show: (row: any) =>
        row.status ===
        "pending",

      onClick: (row: any) => {

        setSelected(row);

        setOpenAssign(true);
      },
    },

  // reject

  {
    icon: (
      <XCircle size={17} />
    ),

    className: `
      bg-red-100
      text-red-700
      hover:bg-red-200
    `,

    show: (row: any) =>
      row.status === "pending",

    onClick: (row: any) => {

      let note = "";

      toast((t) => (

        <div className="w-[320px]">

          <p className="font-semibold text-sm">
            Tolak Ticket?
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Catatan penolakan wajib diisi.
          </p>

          <textarea
            rows={4}
            className="
              w-full
              mt-3
              p-3
              border
              rounded-xl
              text-sm
            "
            placeholder="Masukkan alasan penolakan..."
            onChange={(e) => {
              note = e.target.value;
            }}
          />

          <div className="flex justify-end gap-2 mt-4">

            <button
              onClick={() =>
                toast.dismiss(t.id)
              }
              className="
                px-3
                py-2
                rounded-xl
                border
                text-sm
              "
            >
              Batal
            </button>

            <button
              onClick={async () => {

                if (!note.trim()) {

                  toast.error(
                    "Catatan wajib diisi"
                  );

                  return;
                }

                toast.dismiss(t.id);

                try {

                  await updateStatusTicket(
                    row._id,
                    "rejected",
                    note
                  );

                  toast.success(
                    "Ticket berhasil ditolak"
                  );

                  reload();

                } catch (err: any) {

                  toast.error(
                    err?.response?.data?.message ||
                    "Gagal menolak ticket"
                  );
                }
              }}
              className="
                px-3
                py-2
                rounded-xl
                bg-red-600
                text-white
                text-sm
                hover:bg-red-700
              "
            >
              Ya, Reject
            </button>

          </div>

        </div>

      ), {
        duration: 20000,
      });

    },
  },

    /* ================= START ================= */

    {
      icon: (
        <Play size={17} />
      ),

      className: `
        bg-yellow-100
        text-yellow-700
        hover:bg-yellow-200
      `,

      show: (row: any) =>
        row.status ===
        "approved",

      onClick: (row: any) =>
        handleStatus(row),
    },

    /* ================= DONE ================= */

    {
      icon: (
        <CheckCircle2 size={17} />
      ),

      className: `
        bg-green-100
        text-green-700
        hover:bg-green-200
      `,

      show: (row: any) =>
        row.status ===
        "in_progress",

      onClick: (row: any) =>
        handleStatus(row),
    },

  ];

  /* =====================================================
     UI
  ===================================================== */

  return (

    <div className="
      p-6
      space-y-5
    ">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div>

        <h1 className="
          text-2xl
          font-bold
        ">
          Kelola Ticket
        </h1>

        <p className="
          text-sm
          text-gray-500
          mt-1
        ">
          Monitoring ticket dan progress layanan
        </p>

      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <TableWrapper

        /* ================= VIEW ================= */
        view={view}
        setView={setView}

        /* ================= FILTER ================= */
        filterContent={

          <div className="
            space-y-3
          ">

            {/* STATUS */}
            <div>

              <p className="
                text-xs
                text-gray-500
                mb-1
              ">
                Status Ticket
              </p>

              <select

                value={query.status}

                onChange={(e) =>
                  setQuery((prev) => ({

                    ...prev,

                    status:
                      e.target.value,

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

                <option value="rejected">
                  Rejected
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

              <p className="
                text-xs
                text-gray-500
                mb-1
              ">
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

        /* ================= COLUMNS ================= */

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

            render: (value: string) => (

              <span className={`
                inline-flex
                items-center
                px-3
                py-1
                rounded-full
                text-xs
                font-medium
                ${getStatusBadge(value)}
              `}>

                {value}

              </span>
            ),
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
            <div className="
              flex
              items-start
              justify-between
              gap-3
            ">

              <div>

                <p className="
                  font-semibold
                  text-base
                ">
                  {row.pelangganId?.nama ||
                    "-"}
                </p>

                <p className="
                  text-sm
                  text-gray-500
                  mt-1
                ">
                  {row.layananId?.nama ||
                    "-"}
                </p>

              </div>

              <span className={`
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
              `}>

                {row.status}

              </span>

            </div>

            {/* PIC */}
            <div>

              <p className="
                text-xs
                text-gray-400
              ">
                PIC Pegawai
              </p>

              <p className="
                text-sm
                font-medium
                mt-1
              ">
                {row.pegawaiId?.nama ||
                  "-"}
              </p>

            </div>

          </div>
        )}

      />

      {/* =====================================================
          MODALS
      ===================================================== */}

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

      <AddLogActivityModal
        open={openLog}
        ticket={selected}
        onClose={() => {
          setOpenLog(false);
          setSelected(null);
        }}
        onSuccess={() => {
          reload();
        }}
      />

    </div>
  );
}