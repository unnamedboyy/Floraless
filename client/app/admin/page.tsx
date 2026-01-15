"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import FullCalendarView from "@/components/FullCalendarView";

interface Booking {
  _id?: string;
  customerName: string;
  eventDate: string; // ISO
  packageId: string;
  status: string;
}

let socket: Socket | null = null;

export default function AdminPage() {
  const [status, setStatus] = useState<string>("Disconnected");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // data awal
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/bookings");
        if (!res.ok) return;
        const data: Booking[] = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Error fetch bookings:", err);
      }
    };
    fetchBookings();
  }, []);

  // socket realtime
  useEffect(() => {
    console.log("🔄 Inisialisasi socket client (admin)...");
    socket = io("http://localhost:5000", {
      withCredentials: true,
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      setStatus("Connected: " + socket!.id);
      socket!.emit("join_calendar");
    });

    socket.on("disconnect", (reason) => {
      console.log("admin socket disconnected:", reason);
      setStatus("Disconnected");
    });

    socket.on("booking_created", (booking: Booking) => {
      console.log("admin: booking_created", booking);
      setBookings((prev) => [...prev, booking]);
    });

    socket.on("booking_deleted", (booking: Booking) => {
      console.log("admin: booking_deleted", booking);
      setBookings((prev) => prev.filter((b) => b._id !== booking._id));
    });

    return () => {
      if (socket) {
        console.log("🔌 Cleanup admin socket");
        socket.disconnect();
        socket = null;
      }
    };
  }, []);

  // admin cancel/selesai booking
  const handleCancel = async (bookingId?: string) => {
    if (!bookingId) return;
    const ok = confirm("Tandai booking ini selesai / dibatalkan?");
    if (!ok) return;

    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}/cancel`,
        { method: "PATCH" }
      );
      setLoading(false);

      if (!res.ok) {
        alert("Gagal membatalkan booking");
        return;
      }

      const updated: Booking = await res.json();
      // hapus langsung di list lokal (socket juga akan hapus, tapi ini biar cepat)
      setBookings((prev) => prev.filter((b) => b._id !== updated._id));
    } catch (err) {
      setLoading(false);
      console.error("Error cancel booking:", err);
      alert("Terjadi kesalahan saat membatalkan booking");
    }
  };

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>Halaman Admin – Monitoring & Proses Booking Floraless</h1>
      <p style={{ marginBottom: 16 }}>{status}</p>

      <section style={{ marginBottom: 24 }}>
        <h2>Daftar Booking Aktif</h2>
        {bookings.length === 0 ? (
          <p>Tidak ada booking aktif.</p>
        ) : (
          <ul>
            {bookings.map((b) => (
              <li key={b._id} style={{ marginBottom: 8 }}>
                {b.customerName} –{" "}
                {new Date(b.eventDate).toLocaleString()} – {b.status} –{" "}
                {b.packageId}
                <button
                  onClick={() => handleCancel(b._id)}
                  disabled={loading}
                  style={{
                    marginLeft: 8,
                    padding: "4px 8px",
                    borderRadius: 4,
                    border: "none",
                    backgroundColor: "#cc3333",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Selesai / Batalkan
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Kalender hanya booking yang belum rejected */}
      <FullCalendarView
        bookings={bookings.filter((b) => b.status !== "rejected")}
      />
    </main>
  );
}
