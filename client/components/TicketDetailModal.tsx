"use client";

import Image from "next/image";
import { X, Calendar, Clock } from "lucide-react";

type Props = {
  ticket: any;
  onClose: () => void;
};

export default function TicketDetailModal({ ticket, onClose }: Props) {
  if (!ticket) return null;

  const steps = [
    { key: "created", label: "Booking Dibuat" },
    { key: "pending", label: "Diproses Admin" },
    { key: "approved", label: "Disetujui" },
  ];

  function getStepState(index: number) {
    if (ticket.status === "pending") {
      if (index === 0) return "done";
      if (index === 1) return "active";
      return "todo";
    }

    if (ticket.status === "approved") {
      if (index <= 2) return "done";
    }

    if (ticket.status === "rejected") {
      if (index === 0) return "done";
      if (index === 1) return "active";
      return "todo";
    }

    return "todo";
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">

      {/* WINDOW */}
      <div className="relative w-[700px] max-w-[90vw] rounded-2xl bg-white shadow-2xl overflow-hidden">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-2 rounded-full hover:bg-neutral-100"
        >
          <X size={20} />
        </button>

        {/* IMAGE */}
        <div className="relative h-56 w-full">
          <Image
            src={ticket.layanan?.gambar || "/package-1.jpg"}
            alt="event"
            fill
            className="object-cover"
          />
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6">

          <h2 className="text-2xl font-semibold">
            {ticket.layanan?.nama_layanan}
          </h2>

          {/* DATE */}
          {ticket.tanggal_acara && (
            <div className="flex items-center gap-2 text-neutral-600 text-sm">
              <Calendar size={16} />
              {new Date(ticket.tanggal_acara).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          )}

          {/* CREATED */}
          {ticket.createdAt && (
            <div className="flex items-center gap-2 text-neutral-500 text-sm">
              <Clock size={16} />
              Dibuat {new Date(ticket.createdAt).toLocaleDateString()}
            </div>
          )}

          {/* INFO */}
          <p className="text-neutral-600 text-sm leading-relaxed">
            {ticket.info_acara || "Detail acara belum tersedia."}
          </p>

          {/* TIMELINE */}
          <div className="pt-4 border-t">

            <p className="text-sm text-neutral-500 mb-5">
              Status Proses Booking
            </p>

            <div className="flex items-center justify-between relative">

              {steps.map((step, i) => {
                const state = getStepState(i);

                return (
                  <div
                    key={i}
                    className="flex flex-col items-center flex-1 relative"
                  >

                    {/* LINE */}
                    {i !== 0 && (
                      <div className="absolute left-0 top-3 w-full h-[2px] bg-neutral-200 -z-10" />
                    )}

                    {/* DOT */}
                    <div
                      className={`w-6 h-6 rounded-full border-2
                      ${
                        state === "done"
                          ? "bg-[#C9AE63] border-[#C9AE63]"
                          : state === "active"
                          ? "border-[#C9AE63]"
                          : "border-neutral-300"
                      }`}
                    />

                    {/* LABEL */}
                    <p
                      className={`text-xs mt-3 text-center
                      ${
                        state === "done" || state === "active"
                          ? "text-neutral-900"
                          : "text-neutral-400"
                      }`}
                    >
                      {step.label}
                    </p>

                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}