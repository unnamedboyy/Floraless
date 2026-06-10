"use client";

import FullCalendar
from "@fullcalendar/react";

import dayGridPlugin
from "@fullcalendar/daygrid";

type Props = {
  data: any[];
};

export default function BookingCalendar({
  data,
}: Props) {

  /* =====================================================
     FORMAT EVENTS
  ===================================================== */

const events =
  data.map((item: any) => ({

    id: item._id,
    title: "Booked",
    start: item.tanggal_acara,
    allDay: true,
    backgroundColor:
      item.status === "pending"
        ? "#F59E0B"
        : item.status === "approved"
        ? "#3B82F6"
        : item.status === "in_progress"
        ? "#10B981"
        : item.status === "done"
        ? "#6366F1"
        : "#111111",

    borderColor:
      item.status === "pending"
        ? "#F59E0B"
        : item.status === "approved"
        ? "#3B82F6"
        : item.status === "in_progress"
        ? "#10B981"
        : item.status === "done"
        ? "#6366F1"
        : "#111111",

    textColor: "#ffffff",
  }));

  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <div className="
      rounded-[32px]
      border
      border-[#EFE7DA]
      bg-white
      p-6
      shadow-sm
    ">

      {/* HEADER */}

      <div className="mb-6">

        <p className="
          text-xs
          uppercase
          tracking-[0.3em]
          text-[#C9AE63]
          font-medium
        ">
          EVENT CALENDAR
        </p>

        <h2 className="
          mt-3
          text-[42px]
          font-semibold
          tracking-tight
        ">
          Jadwal Acara
        </h2>

        <p className="
          mt-3
          text-sm
          text-neutral-500
          max-w-2xl
          leading-relaxed
        ">
          Semua rencana acara akan tampil
          pada kalender, termasuk jadwal
          pending dan yang sudah disetujui.
        </p>

      </div>

      {/* CALENDAR */}

      <div className="booking-calendar">

        <FullCalendar

          plugins={[
            dayGridPlugin
          ]}

          initialView="dayGridMonth"
          height="auto"
          events={events}
          headerToolbar={{

            left:
              "prev,next today",

            center:
              "title",

            right: "",
          }}

        />

      </div>

    </div>
  );
}