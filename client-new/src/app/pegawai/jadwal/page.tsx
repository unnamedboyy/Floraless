"use client";

import { useState } from "react";
import { useJadwal } from "@/hooks/useJadwal";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function PegawaiJadwalPage() {
  const today = new Date().toISOString().split("T")[0];

  const [query, setQuery] = useState({
    start: today,
    end: today,
  });

  const { data, loading } = useJadwal(query);

  /* ================= FORMAT EVENT ================= */

  const events = data.map((j: any) => ({
    id: j._id,
    title: j.title || j.ticketId?.layananId?.nama || "Event",
    date: j.tanggal_acara,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Jadwal Saya</h1>

      {/* 🔥 CALENDAR */}
      <div className="bg-white p-4 rounded shadow">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          height="auto"
          eventClick={(info) => {
            const event = data.find((d: any) => d._id === info.event.id);
            alert(JSON.stringify(event, null, 2));
          }}
        />
      </div>

      {/* FILTER */}
      <div className="flex gap-2">
        <input
          type="date"
          value={query.start}
          onChange={(e) =>
            setQuery({ ...query, start: e.target.value })
          }
          className="border p-2"
        />

        <input
          type="date"
          value={query.end}
          onChange={(e) =>
            setQuery({ ...query, end: e.target.value })
          }
          className="border p-2"
        />
      </div>

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Title</th>
              <th>Lokasi</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row: any) => (
              <tr key={row._id}>
                <td>
                  {new Date(row.tanggal_acara).toLocaleDateString()}
                </td>
                <td>{row.title || "-"}</td>
                <td>{row.lokasi || "-"}</td>
                <td>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}