"use client";

import { useCalendarSocket } from "./useCalendarSocket";
import { useEffect, useMemo, useState, useCallback } from "react";
import { apiFetch } from "@/lib/api";

type Props = {
  role: "admin" | "user";
};

export default function CalendarView({ role }: Props) {
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [bookedDates, setBookedDates] = useState<Record<string, string>>({});

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [layananList, setLayananList] = useState<any[]>([]);
  const [selectedLayanan, setSelectedLayanan] = useState("");
  const [infoAcara, setInfoAcara] = useState("");
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [loadingBooking, setLoadingBooking] = useState(false);

  const [adminDetail, setAdminDetail] = useState<any>(null);
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [loadingStatusUpdate, setLoadingStatusUpdate] = useState(false);

  const monthString = `${year}-${String(month + 1).padStart(2, "0")}`;

  const loadSnapshot = useCallback(async () => {
    try {
      const data = await apiFetch(`/jadwal/calendar?month=${monthString}`);
      setBookedDates(data);
    } catch (err) {
      console.error("Gagal load snapshot:", err);
    }
  }, [monthString]);

  useEffect(() => {
    loadSnapshot();
  }, [loadSnapshot]);

  useCalendarSocket(loadSnapshot);

  useEffect(() => {
    if (showModal) {
      apiFetch("/layanan")
        .then(setLayananList)
        .catch(console.error);
    }
  }, [showModal]);

  const goPrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const handleDateClick = async (
    dateKey: string,
    status: string | undefined
  ) => {
    if (role === "user" && !status) {
      setSelectedDate(dateKey);
      setShowModal(true);
    }

    if (role === "admin" && status) {
      try {
        setLoadingAdmin(true);
        setAdminError(null);

        const data = await apiFetch(`/jadwal/by-date?date=${dateKey}`);

        setAdminDetail(data);
      } catch (err: any) {
        setAdminError(err.message);
      } finally {
        setLoadingAdmin(false);
      }
    }
  };

  const days = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const cells: (number | null)[] = [];

    for (let i = 0; i < startDay; i++) cells.push(null);
    for (let d = 1; d <= totalDays; d++) cells.push(d);

    return cells;
  }, [year, month]);

  const getStatusClass = (status: string | undefined) => {
    if (!status) {
      return role === "user"
        ? "border-neutral-200 hover:bg-[#C9AE63]/10 cursor-pointer"
        : "border-neutral-200";
    }

    if (status === "booked")
      return "bg-emerald-500 text-white border-emerald-500";

    if (status === "cancelled")
      return "bg-rose-500 text-white border-rose-500";

    if (status === "pending")
      return "bg-amber-400 text-white border-amber-400";

    return "border-neutral-200";
  };

  return (
    <div className="max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">

        <button
          onClick={goPrevMonth}
          className="h-10 w-10 flex items-center justify-center rounded-full border border-neutral-300 hover:bg-neutral-100 transition"
        >
          ←
        </button>

        <h2 className="text-2xl font-semibold tracking-tight capitalize">
          {new Date(year, month).toLocaleString("id-ID", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <button
          onClick={goNextMonth}
          className="h-10 w-10 flex items-center justify-center rounded-full border border-neutral-300 hover:bg-neutral-100 transition"
        >
          →
        </button>
      </div>

      {/* DAY LABEL */}
      <div className="grid grid-cols-7 gap-4 text-center text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-7 gap-4">
        {days.map((day, idx) => {
          if (!day) return <div key={idx} />;

          const dateKey = `${monthString}-${String(day).padStart(2, "0")}`;
          const status = bookedDates[dateKey];

          return (
            <div
              key={idx}
              onClick={() => handleDateClick(dateKey, status)}
              className={`h-20 rounded-2xl border flex items-center justify-center font-medium shadow-sm transition hover:shadow-md ${getStatusClass(
                status
              )}`}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* USER MODAL */}
      {showModal && selectedDate && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">

            <h3 className="text-lg font-semibold mb-4">
              Booking {selectedDate}
            </h3>

            {bookingError && (
              <div className="text-red-500 text-sm mb-3">
                {bookingError}
              </div>
            )}

            <select
              value={selectedLayanan}
              onChange={(e) => setSelectedLayanan(e.target.value)}
              className="w-full border border-neutral-200 rounded-xl p-3 mb-3"
            >
              <option value="">Pilih Layanan</option>
              {layananList.map((l) => (
                <option key={l._id} value={l._id}>
                  {l.nama_layanan}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Info acara"
              value={infoAcara}
              onChange={(e) => setInfoAcara(e.target.value)}
              className="w-full border border-neutral-200 rounded-xl p-3 mb-3"
            />

            <button
              disabled={loadingBooking}
              onClick={async () => {
                try {
                  if (!selectedLayanan) {
                    setBookingError("Pilih layanan terlebih dahulu");
                    return;
                  }

                  setLoadingBooking(true);
                  setBookingError(null);

                  await apiFetch("/ticket", {
                    method: "POST",
                    body: JSON.stringify({
                      layanan: selectedLayanan,
                      tanggal_acara: selectedDate,
                      info_acara: infoAcara,
                    }),
                  });

                  setShowModal(false);
                } catch (err: any) {
                  setBookingError(err.message);
                } finally {
                  setLoadingBooking(false);
                }
              }}
              className="w-full bg-[#C9AE63] text-white py-3 rounded-xl font-semibold"
            >
              {loadingBooking ? "Processing..." : "Confirm Booking"}
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-3 border border-neutral-200 py-3 rounded-xl"
            >
              Cancel
            </button>

          </div>
        </div>
      )}

      {/* ADMIN MODAL */}
      {adminDetail && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white rounded-3xl p-10 w-full max-w-lg shadow-2xl">

            <h3 className="text-lg font-semibold mb-6">
              Detail Booking {adminDetail.tanggal_key}
            </h3>

            <div className="space-y-3 text-sm">

              <div>
                <strong>Pelanggan:</strong>{" "}
                {adminDetail.ticket?.pelanggan?.username}
              </div>

              <div>
                <strong>Layanan:</strong>{" "}
                {adminDetail.ticket?.layanan?.nama_layanan}
              </div>

              <div>
                <strong>Info Acara:</strong>{" "}
                {adminDetail.ticket?.info_acara || "-"}
              </div>

              <div>
                <strong>Status:</strong>{" "}
                {adminDetail.ticket?.status}
              </div>

            </div>

            <div className="mt-6 flex gap-3">

              <button
                disabled={loadingStatusUpdate}
                onClick={async () => {
                  try {
                    setLoadingStatusUpdate(true);

                    await apiFetch(
                      `/ticket/${adminDetail.ticket._id}/status`,
                      {
                        method: "PATCH",
                        body: JSON.stringify({ status: "approved" }),
                      }
                    );

                    setAdminDetail(null);
                  } finally {
                    setLoadingStatusUpdate(false);
                  }
                }}
                className="flex-1 bg-emerald-500 text-white py-3 rounded-xl"
              >
                Approve
              </button>

              <button
                disabled={loadingStatusUpdate}
                onClick={async () => {
                  try {
                    setLoadingStatusUpdate(true);

                    await apiFetch(
                      `/ticket/${adminDetail.ticket._id}/status`,
                      {
                        method: "PATCH",
                        body: JSON.stringify({ status: "rejected" }),
                      }
                    );

                    setAdminDetail(null);
                  } finally {
                    setLoadingStatusUpdate(false);
                  }
                }}
                className="flex-1 bg-rose-500 text-white py-3 rounded-xl"
              >
                Reject
              </button>

            </div>

            <button
              onClick={() => setAdminDetail(null)}
              className="w-full mt-4 border border-neutral-200 py-3 rounded-xl"
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
}