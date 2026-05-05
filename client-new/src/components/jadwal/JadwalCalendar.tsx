"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

type Props = {
  data: any[];
  onSelectDate: (date: string) => void;
  onSelectEvent: (row: any) => void;
};

export default function JadwalCalendar({
  data,
  onSelectDate,
  onSelectEvent,
}: Props) {

  const events = data.map((item) => ({
    id: item._id,
    title: item.pegawaiId?.nama || "Tanpa Nama",
    date: item.tanggal_acara,
    extendedProps: item,
  }));

  return (
    <div className="bg-white border rounded-xl p-4">

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"

        events={events}

        dateClick={(info) => {
          onSelectDate(info.dateStr);
        }}

        eventClick={(info) => {
          onSelectEvent(info.event.extendedProps);
        }}

        height="auto"
      />

    </div>
  );
}