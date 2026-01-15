"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
export type { Booking };


interface Booking {
  _id?: string;
  customerName: string;
  eventDate: string;
  packageId: string;
  status: string;
}

interface Props {
  bookings: Booking[];
}

export default function FullCalendarView({ bookings }: Props) {
  const events = bookings.map((b) => ({
    id: b._id,
    title: `${b.customerName} (${b.status})`,
    start: b.eventDate,
    allDay: true,
  }));

  return (
    <div className="p-4">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        height={600}
      />
    </div>
  );
}
