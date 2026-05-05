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

  const { data = [], loading } = useJadwal(query);

  /* ================= FORMAT EVENT ================= */

  const events = data.map((j: any) => ({
    id: j._id,
    title: j.title || j.ticketId?.layananId?.nama || "Event",
    date: j.tanggal_acara,
  }));

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <h1 className="text-xl font-semibold">
        Jadwal Saya
      </h1>

      {/* FILTER CARD */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 items-end">

        <div className="flex flex-col">
          <span className="text-xs text-gray-500 mb-1">Dari</span>
          <input
            type="date"
            value={query.start}
            onChange={(e) =>
              setQuery({ ...query, start: e.target.value })
            }
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-gray-500 mb-1">Sampai</span>
          <input
            type="date"
            value={query.end}
            onChange={(e) =>
              setQuery({ ...query, end: e.target.value })
            }
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

      </div>

      {/* CALENDAR */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          height="auto"

          eventClick={(info) => {
            const event = data.find(
              (d: any) => d._id === info.event.id
            );
            alert(JSON.stringify(event, null, 2));
          }}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

        {/* HEADER */}
        <div className="px-4 py-3 border-b text-sm font-medium text-gray-500">
          List Jadwal
        </div>

        {loading ? (
          <div className="p-4 text-sm text-gray-500">
            Loading...
          </div>
        ) : data.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">
            Tidak ada data
          </div>
        ) : (
          <table className="w-full text-sm">

            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-3 text-left">Tanggal</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Lokasi</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {data.map((row: any) => (
                <tr key={row._id} className="border-t">

                  <td className="p-3">
                    {row.tanggal_acara
                      ? new Date(row.tanggal_acara).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="p-3">
                    {row.title ||
                      row.ticketId?.layananId?.nama ||
                      "-"}
                  </td>

                  <td className="p-3">
                    {row.lokasi || "-"}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        row.status === "done"
                          ? "bg-green-100 text-green-700"
                          : row.status === "in_progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {row.status || "-"}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>

    </div>
  );
}