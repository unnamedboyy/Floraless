"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function CustomerPage() {
  const [blockedDates, setBlockedDates] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/calendar-blocks")
      .then(res => res.json())
      .then(data => {
        setBlockedDates(data.map((b: any) => b.date.slice(0, 10)));
      });

    socket.on("calendar_blocked", (block) => {
      setBlockedDates(prev => [...prev, block.date.slice(0, 10)]);
    });

    socket.on("calendar_unblocked", (date) => {
      setBlockedDates(prev =>
        prev.filter(d => d !== date.toISOString().slice(0, 10))
      );
    });

    return () => {
      socket.off();
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Kalender Pemesanan</h1>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={(info) => {
          if (blockedDates.includes(info.dateStr)) {
            alert("Tanggal tidak tersedia");
            return;
          }
          alert(`Pesan untuk tanggal ${info.dateStr}`);
        }}
        events={blockedDates.map(date => ({
          start: date,
          display: "background",
          backgroundColor: "#f87171"
        }))}
      />
    </div>
  );
}
