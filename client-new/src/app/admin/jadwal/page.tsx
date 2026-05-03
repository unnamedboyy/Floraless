"use client";

import { useState, useMemo } from "react";
import { useJadwal } from "@/hooks/useJadwal";
import JadwalFormModal from "@/components/modal/JadwalFormModal";
import {
  createJadwal,
  updateJadwal,
  deleteJadwal,
} from "@/services/jadwal.service";

// 🔥 FullCalendar
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function JadwalPage() {
  const [query, setQuery] = useState({
    start: "",
    end: "",
  });

  const { data, reload } = useJadwal(query);

  const [openForm, setOpenForm] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const [view, setView] = useState<"table" | "calendar">("table");

  /* ================= ACTION ================= */

  const handleSubmit = async (form: any) => {
    try {
      if (selected) {
        await updateJadwal(selected._id, form);
      } else {
        await createJadwal(form);
      }

      setOpenForm(false);
      setSelected(null);
      reload();
    } catch {
      alert("Gagal simpan");
    }
  };

  const handleDelete = async (row: any) => {
    if (!confirm("Hapus jadwal?")) return;

    try {
      await deleteJadwal(row._id);
      reload();
    } catch {
      alert("Gagal hapus");
    }
  };

  /* ================= CALENDAR EVENTS ================= */

  const events = useMemo(() => {
    return data.map((row) => ({
      id: row._id,
      title:
        row.title ||
        row.pegawaiId?.nama ||
        "Jadwal",
      date: row.tanggal_acara,

      // 🔥 warna berdasarkan status
      color:
        row.status === "available"
          ? "#22c55e"
          : row.status === "booked"
          ? "#3b82f6"
          : row.status === "ongoing"
          ? "#f59e0b"
          : "#6b7280",
    }));
  }, [data]);

  /* ================= HANDLER ================= */

  // klik tanggal kosong → create
  const handleDateClick = (info: any) => {
    setSelected({
      tanggal_acara: info.dateStr,
    });
    setOpenForm(true);
  };

  // klik event → edit
  const handleEventClick = (info: any) => {
    const found = data.find((d) => d._id === info.event.id);
    setSelected(found);
    setOpenForm(true);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Kelola Jadwal</h1>

      {/* 🔥 TOGGLE VIEW */}
      <div className="flex gap-2">
        <button
          onClick={() => setView("table")}
          className={`px-3 py-1 border ${
            view === "table" && "bg-black text-white"
          }`}
        >
          Table
        </button>

        <button
          onClick={() => setView("calendar")}
          className={`px-3 py-1 border ${
            view === "calendar" && "bg-black text-white"
          }`}
        >
          Calendar
        </button>
      </div>

      {/* ================= TABLE ================= */}
      {view === "table" && (
        <>
        <div className="flex gap-2 items-center">
            <div>
                <p className="text-xs">Dari</p>
                <input
                type="date"
                onChange={(e) =>
                    setQuery({ ...query, start: e.target.value })
                }
                className="border p-2"
                />
            </div>

        <div>
            <p className="text-xs">Sampai</p>
            <input
            type="date"
            onChange={(e) =>
                setQuery({ ...query, end: e.target.value })
            }
            className="border p-2"
            />
        </div>

        <button
            onClick={() => setOpenForm(true)}
            className="bg-black text-white px-4 h-[40px]"
        >
            + Tambah
        </button>
        </div>

          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Tanggal</th>
                <th className="p-2">Title</th>
                <th className="p-2">Lokasi</th>
                <th className="p-2">Pegawai</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {data.map((row) => (
                <tr key={row._id} className="border-t">
                  <td className="p-2">
                    {new Date(row.tanggal_acara).toLocaleDateString()}
                  </td>

                  <td className="p-2">{row.title}</td>
                  <td className="p-2">{row.lokasi}</td>
                  <td className="p-2">
                    {row.pegawaiId?.nama || "-"}
                  </td>
                  <td className="p-2">{row.status}</td>

                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => {
                        setSelected(row);
                        setOpenForm(true);
                      }}
                      className="text-blue-500"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(row)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ================= CALENDAR ================= */}
      {view === "calendar" && (
        <div className="bg-white p-4 rounded shadow">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            height="auto"

            dateClick={handleDateClick}
            eventClick={handleEventClick}
          />
        </div>
      )}

      {/* ================= MODAL ================= */}
      <JadwalFormModal
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelected(null);
        }}
        onSubmit={handleSubmit}
        initialData={selected}
      />
    </div>
  );
}