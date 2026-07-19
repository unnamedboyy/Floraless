"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Calendar } from "lucide-react";

import DetailJadwalModal from "@/components/modal/DetailJadwalModal";

/* =========================================================
   MOCK DATA JADWAL (Contoh struktur data API)
========================================================= */
const MOCK_EVENTS = [
  {
    id: "sched-101",
    title: "Dekorasi Wedding Raisa & Hamish",
    start: "2026-07-20", // format YYYY-MM-DD
    status: "ongoing",
    tanggal_acara: "2026-07-20",
    jam_mulai: "08:00",
    jam_selesai: "17:00",
    lokasi: "Grand Ballroom Mulia Hotel, Jakarta",
    catatan: "Harap bawa cadangan lampu LED sorot warna warm white.",
    pegawaiId: {
      nama: "Kaisar Simatupang",
    },
    ticketId: {
      _id: "tkt-99901",
      detail: {
        nama_acara: "Dekorasi Wedding Raisa & Hamish",
        lokasi: "Grand Ballroom Mulia Hotel, Jakarta",
        jam_mulai: "08:00",
        jam_selesai: "17:00",
        catatan: "Harap bawa cadangan lampu LED sorot warna warm white.",
      },
    },
    createdAt: "2026-07-15T09:00:00.000Z",
  },
  {
    id: "sched-102",
    title: "Setup Gathering Perusahaan BCA",
    start: "2026-07-22",
    status: "booked",
    tanggal_acara: "2026-07-22",
    jam_mulai: "10:00",
    jam_selesai: "15:00",
    lokasi: "BCA Learning Institute, Sentul",
    catatan: "Tema dekorasi full banking blue & corporate clean.",
    pegawaiId: {
      nama: "Brian",
    },
    ticketId: "tkt-99902", // Mendukung format string direct ID maupun object
    createdAt: "2026-07-16T10:30:00.000Z",
  },
];

export default function EventCalendar() {
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedEventData, setSelectedEventData] = useState<any>(null);

  // Handler ketika salah satu event/jadwal di kalender diklik
  const handleEventClick = (info: any) => {
    // Cari data object original berdasarkan ID dari event yang diklik
    const originalData = events.find((e) => e.id === info.event.id);
    if (originalData) {
      setSelectedEventData(originalData);
      setDetailModalOpen(true);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-black text-white rounded-2xl">
          <Calendar size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Jadwal Acara</h1>
          <p className="text-sm text-slate-500">
            Klik pada salah satu jadwal di kalender untuk melihat detail lengkap dan tiket terkait.
          </p>
        </div>
      </div>

      {/* CALENDAR CONTAINER */}
      <div className="bg-white border border-slate-200 rounded-[30px] p-6 shadow-sm">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={handleEventClick}
          height="auto"
          locale="id"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek",
          }}
          eventClassNames={(arg) => {
            // custom style warna bubble event sesuai status
            const status = arg.event.extendedProps.status;
            if (status === "ongoing") return "!bg-blue-500 !border-blue-600 text-white cursor-pointer rounded-lg px-2 py-0.5";
            if (status === "booked") return "!bg-amber-500 !border-amber-600 text-white cursor-pointer rounded-lg px-2 py-0.5";
            if (status === "done") return "!bg-slate-500 !border-slate-600 text-white cursor-pointer rounded-lg px-2 py-0.5";
            return "!bg-emerald-500 !border-emerald-600 text-white cursor-pointer rounded-lg px-2 py-0.5";
          }}
        />
      </div>

      {/* INTEGRASI DETAIL JADWAL MODAL */}
      <DetailJadwalModal
        open={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedEventData(null);
        }}
        data={selectedEventData}
      />
    </div>
  );
}