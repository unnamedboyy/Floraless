// tugas page

"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  Eye,
  Play,
  CheckCircle2,
  FileText,
} from "lucide-react";

import TableWrapper from "@/components/table/TableWrapper";
import TicketDetailModal from "@/components/modal/TicketDetailModal";
import { useTickets } from "@/hooks/useTickets";

import {
  updateStatusTicket,
} from "@/services/ticket.service";

import AddLogActivityModal
from "@/components/modal/AddLogActivityModal";

/* =====================================================
   BADGE
===================================================== */

const getStatusBadge = (
  status: string
) => {
  const map: any = {
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

export default function PegawaiTugasPage() {
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

  const [searchInput, setSearchInput] =
    useState("");

  const [detailId, setDetailId] =
    useState<string | null>(
      null
    );

  const [openLog, setOpenLog] =
    useState(false);

  const [selected, setSelected] =
    useState<any>(null);

  /* =====================================================
     DATA
  ===================================================== */

  const {
    data = [],
    total = 0,
    reload,
  } = useTickets(query);

  /* =====================================================
     DEBOUNCE SEARCH
  ===================================================== */

  useEffect(() => {
    const t = setTimeout(() => {
      setQuery((q) => ({
        ...q,
        search: searchInput,
        page: 1,
      }));
    }, 400);

    return () =>
      clearTimeout(t);
  }, [searchInput]);

  /* =====================================================
     UPDATE STATUS
  ===================================================== */

  const handleStatus = async (row: any) => {
    let nextStatus = "";
    let title = "";
    let description = "";
    let buttonText = "";

    if (row.status === "approved") {
      nextStatus = "in_progress";
      title = "Mulai Pengerjaan?";
      description =
        "Ticket akan dipindahkan ke status In Progress.";
      buttonText = "Mulai";
    }

    if (row.status === "in_progress") {
      nextStatus = "done";
      title = "Selesaikan Tugas?";
      description =
        "Ticket akan ditandai sebagai selesai.";
      buttonText = "Selesaikan";
    }

    if (!nextStatus) return;

    toast(
      (t) => (
        <div className="w-[300px]">
          <p className="font-semibold text-sm">
            {title}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            {description}
          </p>

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
                    err?.response?.data
                      ?.message ||
                      "Gagal update status"
                  );
                }
              }}
              className="
                px-3
                py-2
                rounded-xl
                bg-green-500
                text-white
                text-sm
                hover:bg-green-600
              "
            >
              {buttonText}
            </button>
          </div>
        </div>
      ),
      {
        duration: 10000,
      }
    );
  };

  /* =====================================================
     ACTIONS
  ===================================================== */

  const actions = [
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

      onClick: handleStatus,
    },

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

      onClick: handleStatus,
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
      row.status !== "done",

    onClick: (row: any) => {

      setSelected(row);

      setOpenLog(true);
    },
  },
  ];

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="p-6 space-y-5">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div>
        <h1 className="
          text-2xl
          font-bold
        ">
          Tugas Saya
        </h1>

        <p className="
          text-sm
          text-gray-500
          mt-1
        ">
          Monitoring progress
          pekerjaan yang
          ditugaskan kepada
          Anda
        </p>
      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <TableWrapper
        view={view}
        setView={setView}
        filterContent={
          <div className="space-y-3">
            {/* STATUS */}

            <div>
              <p className="
                text-xs
                text-gray-500
                mb-1
              ">
                Status Tugas
              </p>

              <select
                value={
                  query.status
                }
                onChange={(e) =>
                  setQuery(
                    (prev) => ({
                      ...prev,
                      status:
                        e.target
                          .value,
                      page: 1,
                    })
                  )
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
              <p className="
                text-xs
                text-gray-500
                mb-1
              ">
                Data per
                halaman
              </p>

              <select
                value={
                  query.limit
                }
                onChange={(e) =>
                  setQuery(
                    (prev) => ({
                      ...prev,
                      limit:
                        Number(
                          e.target
                            .value
                        ),
                      page: 1,
                    })
                  )
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
                setSearchInput(
                  ""
                );

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
            label:
              "Pelanggan",
            key:
              "pelangganId.nama",
          },

          {
            label:
              "Layanan",
            key:
              "layananId.nama",
          },

          {
            label:
              "Tanggal Acara",

            key:
              "tanggal_acara",

            render:
              (
                value: string
              ) =>
                value
                  ? new Date(
                      value
                    ).toLocaleDateString(
                      "id-ID"
                    )
                  : "-",
          },

          {
            label:
              "Status",

            key:
              "status",

            render: (
              value: string
            ) => (
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
                    value
                  )}
                `}
              >
                {value}
              </span>
            ),
          },
        ]}
        actions={actions}
        renderItem={(
          row
        ) => (
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
                  {row
                    .pelangganId
                    ?.nama ||
                    "-"}
                </p>

                <p className="
                  text-sm
                  text-gray-500
                  mt-1
                ">
                  {row
                    .layananId
                    ?.nama ||
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

            {/* TANGGAL */}

            <div>
              <p className="
                text-xs
                text-gray-400
              ">
                Tanggal Acara
              </p>

              <p className="
                text-sm
                font-medium
                mt-1
              ">
                {row.tanggal_acara
                  ? new Date(
                      row.tanggal_acara
                    ).toLocaleDateString(
                      "id-ID"
                    )
                  : "-"}
              </p>
            </div>
          </div>
        )}
      />

      {/* =====================================================
          MODAL
      ===================================================== */}

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