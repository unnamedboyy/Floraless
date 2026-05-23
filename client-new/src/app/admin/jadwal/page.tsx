"use client";

import { useState } from "react";

import TableWrapper from "@/components/table/TableWrapper";

import JadwalCalendar from "@/components/jadwal/JadwalCalendar";

import JadwalFormModal from "@/components/form/JadwalFormModal";

import DetailJadwalModal from "@/components/modal/DetailJadwalModal";

import {
  createJadwal,
  updateJadwal,
  deleteJadwal,
} from "@/services/jadwal.service";

import { useJadwal } from "@/hooks/useJadwal";

export default function JadwalPage() {

  /* ================= STATE ================= */

  const [view, setView] =
    useState<"list" | "grid">(
      "list"
    );

  const [mode, setMode] =
    useState<"table" | "calendar">(
      "table"
    );

  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    search: "",
    start: "",
    end: "",
    status: "",
  });

  const [openForm, setOpenForm] =
    useState(false);

  const [openDetail, setOpenDetail] =
    useState(false);

  const [selected, setSelected] =
    useState<any>(null);

  /* ================= DATA ================= */

  const {
    data = [],
    loading,
    refetch,
  } = useJadwal(query);

  /* ================= ACTION ================= */

  const handleSubmit =
    async (form: any) => {

      try {

        if (selected?._id) {

          await updateJadwal(
            selected._id,
            form
          );

        } else {

          await createJadwal(
            form
          );
        }

        setOpenForm(false);

        setSelected(null);

        refetch();

      } catch (err) {

        console.error(err);

        alert(
          "Gagal menyimpan"
        );
      }
    };

  const handleDelete =
    async (row: any) => {

      if (
        !confirm(
          "Hapus jadwal?"
        )
      ) return;

      try {

        await deleteJadwal(
          row._id
        );

        refetch();

      } catch (err) {

        console.error(err);

        alert(
          "Gagal menghapus"
        );
      }
    };

  /* ================= BADGE ================= */

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

  /* ================= UI ================= */

  return (

    <div className="p-6 space-y-5">

      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-bold">
            Kelola Jadwal
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Kelola jadwal acara dan penugasan pegawai
          </p>

        </div>

        <button
          onClick={() => {

            setSelected(null);

            setOpenForm(true);
          }}
          className="
            bg-black
            text-white
            px-4
            py-2.5
            rounded-2xl
            text-sm
          "
        >
          + Tambah
        </button>

      </div>

      {/* ================= MODE SWITCH ================= */}
      <div className="flex gap-2">

        <button
          onClick={() =>
            setMode("table")
          }
          className={`
            px-4
            py-2
            rounded-2xl
            text-sm
            ${
              mode === "table"
                ? "bg-black text-white"
                : "border bg-white"
            }
          `}
        >
          Table
        </button>

        <button
          onClick={() =>
            setMode("calendar")
          }
          className={`
            px-4
            py-2
            rounded-2xl
            text-sm
            ${
              mode === "calendar"
                ? "bg-black text-white"
                : "border bg-white"
            }
          `}
        >
          Calendar
        </button>

      </div>

      {/* ================= CONTENT ================= */}
      {mode === "table" ? (

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

              {/* DATE START */}
              <div>

                <p className="text-xs text-gray-500 mb-1">
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

              {/* DATE END */}
              <div>

                <p className="text-xs text-gray-500 mb-1">
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
                onClick={() =>
                  setQuery({
                    page: 1,
                    limit: 10,
                    search: "",
                    start: "",
                    end: "",
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
              label: "Pegawai",
              key: "pegawaiId.nama",
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
              label: "Detail",

              onClick: (row) => {

                setSelected(row);

                setOpenDetail(true);
              },
            },

            {
              label: "Edit",

              onClick: (row) => {

                setSelected(row);

                setOpenForm(true);
              },
            },

            {
              label: "Delete",

              onClick: handleDelete,
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
              <div className="flex items-start justify-between gap-3">

                <div>

                  <p className="font-semibold text-base">
                    {row.title ||

                      row.ticketId
                        ?.layananId
                        ?.nama ||

                      "-"}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    {row.pegawaiId
                      ?.nama || "-"}
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

                <p className="text-xs text-gray-400">
                  Tanggal Acara
                </p>

                <p className="text-sm font-medium mt-1">
                  {row.tanggal_acara

                    ? new Date(
                        row.tanggal_acara
                      ).toLocaleDateString(
                        "id-ID"
                      )

                    : "-"}
                </p>

              </div>

              {/* LOCATION */}
              <div className="pt-2 border-t">

                <p className="text-xs text-gray-400">
                  Lokasi
                </p>

                <p className="text-sm mt-1">
                  {row.lokasi || "-"}
                </p>

              </div>

            </div>
          )}

        />

      ) : (

        <JadwalCalendar
          data={data}
          refetch={refetch}

          onSelect={(row: any) => {

            setSelected(row);

            setOpenDetail(true);
          }}
        />

      )}

      {/* ================= LOADING ================= */}
      {loading && (

        <p className="text-sm text-gray-500">
          Loading...
        </p>

      )}

      {/* ================= FORM ================= */}
      <JadwalFormModal
        open={openForm}

        onClose={() => {

          setOpenForm(false);

          setSelected(null);
        }}

        onSubmit={handleSubmit}

        initialData={selected}
      />

      {/* ================= DETAIL ================= */}
      <DetailJadwalModal
        open={openDetail}

        data={selected}

        onClose={() => {

          setOpenDetail(false);

          setSelected(null);
        }}
      />

    </div>
  );
}