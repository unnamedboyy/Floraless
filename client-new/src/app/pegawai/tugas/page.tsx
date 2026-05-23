"use client";

import { useState } from "react";

import TableWrapper
from "@/components/table/TableWrapper";

import { useTickets }
from "@/hooks/useTickets";

import {
  updateStatusTicket,
} from "@/services/ticket.service";

export default function PegawaiTugasPage() {

  /* =====================================================
     STATE
  ===================================================== */

  const [query, setQuery] =
    useState({

      page: 1,

      limit: 5,

      status: "",

      search: "",
    });

  /* 🔥 VIEW */
  const [view, setView] =
    useState<"list" | "grid">(
      "list"
    );

  /* =====================================================
     DATA
  ===================================================== */

  const {
    data = [],
    total = 0,
    reload,
  } = useTickets(query);

  /* =====================================================
     ACTION
  ===================================================== */

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

      if (!nextStatus)
        return;

      try {

        await updateStatusTicket(
          row._id,
          nextStatus
        );

        reload();

      } catch (err) {

        console.error(err);

        alert(
          "Gagal update status"
        );
      }
    };

  /* =====================================================
     BADGE
  ===================================================== */

  const getStatusBadge =
    (status: string) => {

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

  /* =====================================================
     UI
  ===================================================== */

  return (

    <div className="
      p-6
      space-y-6
    ">

      {/* =================================================
         HEADER
      ================================================= */}

      <div className="
        rounded-3xl
        border
        bg-white
        p-6
        shadow-sm
      ">

        <p className="
          text-sm
          uppercase
          tracking-[0.3em]
          text-[#C9AE63]
        ">
          Tugas
        </p>

        <h1 className="
          mt-3
          text-3xl
          font-bold
        ">
          Tugas Saya
        </h1>

        <p className="
          mt-3
          max-w-2xl
          text-gray-500
        ">
          Monitoring progress tugas
          dan status pekerjaan pegawai.
        </p>

      </div>

      {/* =================================================
         TABLE
      ================================================= */}

      <div className="
        rounded-3xl
        border
        bg-white
        p-4
        shadow-sm
      ">

        <TableWrapper

          /* 🔥 VIEW */
          view={view}
          setView={setView}

          /* 🔥 FILTER */
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
                onClick={() =>
                  setQuery({
                    page: 1,
                    limit: 5,
                    status: "",
                    search: "",
                  })
                }
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
              label: "Tanggal",
              key: "tanggal_acara",
            },

            {
              label: "Status",
              key: "status",
            },

          ]}

          actions={[

            {
              label: "Start",

              show: (row) =>
                row.status ===
                "approved",

              onClick: handleStatus,
            },

            {
              label: "Done",

              show: (row) =>
                row.status ===
                "in_progress",

              onClick: handleStatus,
            },

          ]}

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
                    {
                      row.pelangganId
                        ?.nama || "-"
                    }
                  </p>

                  <p className="
                    text-sm
                    text-gray-500
                    mt-1
                  ">
                    {
                      row.layananId
                        ?.nama || "-"
                    }
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

              {/* DATE */}
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

      </div>

    </div>
  );
}