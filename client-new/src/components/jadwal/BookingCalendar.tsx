"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

type Props = {
  data: any[];
};

export default function BookingCalendar({
  data,
}: Props) {

  const events =
    data.map((item: any) => ({

      id: item._id,

      title: "Booked",

      start:
        item.tanggal_acara,

      allDay: true,

      backgroundColor: "#111111",
      borderColor: "#111111",
      textColor: "#ffffff",
    }));

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
          AVAILABILITY
        </p>

        <h2 className="
          mt-3
          text-3xl
          font-semibold
          tracking-tight
        ">
          Cek Jadwal Tersedia
        </h2>

        <p className="
          mt-3
          text-sm
          text-neutral-500
          max-w-2xl
          leading-relaxed
        ">
          Tanggal yang memiliki acara akan ditandai
          sebagai booked dan tidak dapat dipilih
          untuk booking baru.
        </p>

      </div>

      {/* CALENDAR */}
      <div className="booking-calendar">

        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          height="auto"
          events={events}

          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
        />

      </div>

    </div>
  );
}