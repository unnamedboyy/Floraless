// jadwal page

"use client";

import { useState } from "react";

import { useJadwal }
from "@/hooks/useJadwal";

import TableWrapper
from "@/components/table/TableWrapper";

import JadwalCalendar
from "@/components/jadwal/JadwalCalendar";

import DetailJadwalModal
from "@/components/modal/DetailJadwalModal";

import {
  Eye,
  Check,
  X,
} from "lucide-react";

export default function PegawaiJadwalPage() {

  /* =====================================================
     STATE
  ===================================================== */

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const [mode, setMode] =
    useState<"table" | "calendar">(
      "calendar"
    );

  const [view, setView] =
    useState<"list" | "grid">(
      "list"
    );

  const [query, setQuery] =
    useState({

      page: 1,

      limit: 10,

      search: "",

      start: today,

      end: "2099-12-31",

      status: "",
    });

  const [selected, setSelected] =
    useState<any>(null);

  const [open, setOpen] =
    useState(false);

  /* =====================================================
     DATA
  ===================================================== */

  const {
    data = [],
    loading,
    refetch,
  } = useJadwal(query);

  /* =====================================================
     ACTION
  ===================================================== */

  const handleSelect =
    (event: any) => {

      setSelected(event);

      setOpen(true);
    };

  /* =====================================================
     BADGE
  ===================================================== */

  const getStatusBadge =
    (status: string) => {

      const map: any = {

        pending:
          "bg-yellow-100 text-yellow-700 border border-yellow-200",

        approved:
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

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <div>

          <h1
            className="
              text-2xl
              font-bold
            "
          >
            Jadwal
          </h1>

          <p
            className="
              text-sm
              text-gray-500
              mt-1
            "
          >
            Monitoring dan verifikasi jadwal pekerjaan
          </p>

        </div>

      </div>

      {/* =================================================
         MODE SWITCH
      ================================================= */}

      <div className="flex gap-2">

        <button
          onClick={() =>
            setMode("calendar")
          }
          className={`
            px-4
            py-2
            rounded-2xl
            text-sm
            transition

            ${
              mode === "calendar"

                ? "bg-black text-white"

                : `
                  border
                  bg-white
                  hover:bg-gray-50
                `
            }
          `}
        >
          Calendar
        </button>

        <button
          onClick={() =>
            setMode("table")
          }
          className={`
            px-4
            py-2
            rounded-2xl
            text-sm
            transition

            ${
              mode === "table"

                ? "bg-black text-white"

                : `
                  border
                  bg-white
                  hover:bg-gray-50
                `
            }
          `}
        >
          Table
        </button>

      </div>

      {/* =================================================
         CONTENT
      ================================================= */}

      <div>
        {mode === "calendar" ? (

          <JadwalCalendar
            data={data}
            refetch={refetch}
            onSelect={handleSelect}
          />

        ) : (

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
                    Status Jadwal
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

                    <option value="done">
                      Done
                    </option>

                  </select>

                </div>

                {/* START */}
                <div>

                  <p className="
                    text-xs
                    text-gray-500
                    mb-1
                  ">
                    Dari Tanggal
                  </p>

                  <input
                    type="date"
                    value={query.start}
                    onChange={(e) =>
                      setQuery((prev) => ({
                        ...prev,
                        start:
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
                  />

                </div>

                {/* END */}
                <div>

                  <p className="
                    text-xs
                    text-gray-500
                    mb-1
                  ">
                    Sampai Tanggal
                  </p>

                  <input
                    type="date"
                    value={query.end}
                    onChange={(e) =>
                      setQuery((prev) => ({
                        ...prev,
                        end:
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
                  />

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
                      limit: 10,
                      search: "",
                      start: today,
                      end: today,
                      status: "",
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
            total={data.length}

            query={query}
            setQuery={setQuery}

            columns={[

              {
                label: "Tanggal",
                key: "tanggal_acara",
              },

              {
                label: "Title",
                key: "title",
              },

              {
                label: "Lokasi",
                key: "lokasi",
              },

              {
                label: "Status",
                key: "status",
              },

            ]}

            actions={[

                {
                  icon: (
                    <Eye size={17} />
                  ),

                  className: `
                    bg-gray-100
                    text-gray-700
                    hover:bg-gray-200
                  `,

                  onClick: (row) =>
                    setSelected(row),
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
                      {row.title ||

                        row.ticketId
                          ?.layananId
                          ?.nama ||

                        "-"}
                    </p>

                    <p className="
                      text-sm
                      text-gray-500
                      mt-1
                    ">
                      {row.lokasi || "-"}
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

              </div>
            )}

          />

        )}

      </div>

      {/* =================================================
         LOADING
      ================================================= */}

      {loading && (

        <p className="
          text-sm
          text-gray-500
        ">
          Loading...
        </p>

      )}

      {/* =================================================
         MODAL
      ================================================= */}

      <DetailJadwalModal
        open={open}
        data={selected}
        onClose={() =>
          setOpen(false)
        }
      />

    </div>
  );
}