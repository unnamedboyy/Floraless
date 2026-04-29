"use client";

import CalendarView from "@/components/calendar/CalendarView";

export default function AdminCalendarPage() {
  return (
    <div className="bg-neutral-100 min-h-screen">

      <div className="p-10 space-y-10">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-semibold">
            Event Calendar
          </h1>

          <p className="text-sm text-neutral-500 mt-2">
            Monitor jadwal event dan booking pelanggan
          </p>
        </div>

        {/* LEGEND */}
        <div className="flex gap-6 text-sm">

          <Legend color="bg-emerald-500" label="Approved Event" />
          <Legend color="bg-amber-400" label="Pending Booking" />
          <Legend color="bg-rose-500" label="Cancelled Event" />
          <Legend color="border border-neutral-300" label="Available Date" />

        </div>

        {/* CALENDAR */}
        <div className="bg-white rounded-2xl shadow-sm p-8">

          <CalendarView role="admin" />

        </div>

      </div>

    </div>
  );
}

function Legend({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 rounded ${color}`} />
      <span className="text-neutral-600">{label}</span>
    </div>
  );
}