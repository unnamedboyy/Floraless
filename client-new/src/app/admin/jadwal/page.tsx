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

  const [view, setView] = useState<"list" | "grid">("list");
  const [mode, setMode] = useState<"table" | "calendar">("table");

  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    search: "",
    start: "",
    end: "",
  });

  const [openForm, setOpenForm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  const [selected, setSelected] = useState<any>(null);

  /* ================= DATA ================= */

  const {
  data = [],
  loading,
  refetch,
  } = useJadwal(query);

  /* ================= ACTION ================= */

  const handleSubmit = async (form: any) => {
    try {
      if (selected?._id) {
        await updateJadwal(selected._id, form);
      } else {
        await createJadwal(form);
      }

      setOpenForm(false);
      setSelected(null);

      refetch();

    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan");
    }
  };

  const handleDelete = async (row: any) => {
    if (!confirm("Hapus jadwal?")) return;

    try {
      await deleteJadwal(row._id);

      refetch();

    } catch (err) {
      console.error(err);
      alert("Gagal menghapus");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-4">

      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">

        <h1 className="text-xl font-semibold">
          Kelola Jadwal
        </h1>

        <button
          onClick={() => {
            setSelected(null);
            setOpenForm(true);
          }}
          className="bg-black text-white px-4 py-2 rounded-xl text-sm"
        >
          + Tambah
        </button>

      </div>

      {/* ================= MODE SWITCH ================= */}
      <div className="flex gap-2">

        <button
          onClick={() => setMode("table")}
          className={`px-4 py-2 rounded-xl text-sm ${
            mode === "table"
              ? "bg-black text-white"
              : "border"
          }`}
        >
          Table
        </button>

        <button
          onClick={() => setMode("calendar")}
          className={`px-4 py-2 rounded-xl text-sm ${
            mode === "calendar"
              ? "bg-black text-white"
              : "border"
          }`}
        >
          Calendar
        </button>

      </div>

      {/* ================= FILTER ================= */}
      <div className="flex gap-4">

        <div>
          <p className="text-xs text-gray-500">
            Dari
          </p>

          <input
            type="date"
            value={query.start}
            onChange={(e) =>
              setQuery({
                ...query,
                start: e.target.value,
                page: 1,
              })
            }
            className="border rounded-xl px-3 py-2 text-sm"
          />
        </div>

        <div>
          <p className="text-xs text-gray-500">
            Sampai
          </p>

          <input
            type="date"
            value={query.end}
            onChange={(e) =>
              setQuery({
                ...query,
                end: e.target.value,
                page: 1,
              })
            }
            className="border rounded-xl px-3 py-2 text-sm"
          />
        </div>

      </div>

      {/* ================= CONTENT ================= */}
      {mode === "table" ? (

        <TableWrapper
          data={data}
          total={data.length}

          query={query}
          setQuery={setQuery}

          view={view}
          setView={setView}

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

          renderItem={(row) => (
            <div className="bg-white border rounded-xl p-4">

              <p className="font-semibold">
                {row.title ||
                  row.ticketId?.layananId?.nama ||
                  "-"}
              </p>

              <p className="text-sm text-gray-500">
                {row.pegawaiId?.nama || "-"}
              </p>

              <p className="text-xs text-gray-400">
                {row.tanggal_acara
                  ? new Date(
                      row.tanggal_acara
                    ).toLocaleDateString()
                  : "-"}
              </p>

              <p className="text-xs text-gray-400">
                {row.lokasi || "-"}
              </p>

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