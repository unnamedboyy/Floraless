"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import axios from "@/lib/axios";
import { toast } from "sonner";

interface Props {
  data: any[];
  onSelect?: (data: any) => void;
  refetch?: () => void;
}

export default function JadwalCalendar({
  data,
  onSelect,
  refetch
}: Props) {

  /* =====================================================
     FORMAT EVENTS
  ===================================================== */
  const events = data.map((j: any, index: number) => {

    console.log("DATA:", data);
    console.log("TOTAL:", data.length);

    const formattedDate = j.tanggal_acara
      ? new Date(j.tanggal_acara)
          .toISOString()
          .split("T")[0]
      : "";

    return {
      // 🔥 HARUS UNIQUE
      id: `${j._id}-${index}`,

      title:
        j.title?.trim()
          ? j.title
          : j.ticketId?.layananId?.nama ||
            "Event",

      start: formattedDate,

      allDay: true,

      extendedProps: {
        fullData: j
      },

      color:
        j.status === "done"
          ? "#22c55e"
          : j.status === "ongoing"
          ? "#f59e0b"
          : "#3b82f6",

      textColor: "#ffffff"
    };
  });

  /* =====================================================
     DRAG DROP
  ===================================================== */
  const handleDrop = async (info: any) => {
    try {

      const realId =
        info.event.extendedProps.fullData._id;

      await axios.put(`/jadwal/${realId}`, {
        tanggal_acara: info.event.startStr
      });

      toast.success(
        "Jadwal berhasil dipindahkan"
      );

      refetch?.();

    } catch (err: any) {

      info.revert();

      toast.error(
        err?.response?.data?.message ||
        "Gagal update jadwal"
      );
    }
  };

  /* =====================================================
     CLICK EVENT
  ===================================================== */
  const handleClick = (info: any) => {

    const fullData =
      info.event.extendedProps.fullData;

    onSelect?.(fullData);
  };

  /* =====================================================
     RENDER
  ===================================================== */
  return (
    <div className="bg-white rounded-2xl border p-4">

      <FullCalendar
        plugins={[
          dayGridPlugin,
          interactionPlugin
        ]}

        initialView="dayGridMonth"

        height="auto"

        editable={true}

        selectable={true}

        events={events}

        eventClick={handleClick}

        eventDrop={handleDrop}

        headerToolbar={{
          left: "title",
          center: "",
          right: "today prev,next"
        }}

        buttonText={{
          today: "today"
        }}
      />

    </div>
  );
}