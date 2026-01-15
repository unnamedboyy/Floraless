"use client";

import {
  useEffect,
  useState,
  FormEvent,
  ChangeEvent,
} from "react";
import { io, Socket } from "socket.io-client";
import FullCalendarView from "@/components/FullCalendarView";

interface Booking {
  _id?: string;
  customerName: string;
  eventDate: string; // ISO string
  packageId: string;
  status: string; // "pending" | "approved" | "rejected"
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

let socket: Socket | null = null;

export default function CustomerPage() {
  const [status, setStatus] = useState<string>("Disconnected");
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [form, setForm] = useState({
    customerName: "",
    eventDate: "",
    eventTime: "",
    packageId: "",
  });

  // Ambil data awal
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

  // Setup socket realtime
  useEffect(() => {
    console.log("🔄 Inisialisasi socket client (customer)...");
    socket = io("http://localhost:5000", {
      withCredentials: true,
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket!.id);
      setStatus("Connected: " + socket!.id);
      socket!.emit("join_calendar");
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setStatus("Disconnected");
    });

    socket.on("connect_error", (err) => {
      console.error("❌ connect_error:", err.message);
    });

    socket.on("booking_conflict", (payload: { message: string }) => {
      console.warn("⛔ booking_conflict:", payload);
      alert(payload.message || "Tanggal tersebut sudah dibooking.");
    });

    socket.on("booking_created", (booking: Booking) => {
      console.log("📩 booking_created received:", booking);
      setBookings((prev) => [...prev, booking]);
    });

    socket.on("booking_deleted", (booking: Booking) => {
      console.log("🗑 booking_deleted received:", booking);
      setBookings((prev) => prev.filter((b) => b._id !== booking._id));
    });

    return () => {
      if (socket) {
        console.log("🔌 Cleanup customer socket");
        socket.disconnect();
        socket = null;
      }
    };
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!socket) {
      alert("Koneksi ke server belum siap.");
      return;
    }

    if (!form.customerName || !form.eventDate || !form.packageId) {
      alert("Nama, tanggal, dan paket wajib diisi.");
      return;
    }

    // gabung tanggal + jam
    let eventDate: Date;
    if (form.eventTime) {
      eventDate = new Date(`${form.eventDate}T${form.eventTime}`);
    } else {
      eventDate = new Date(form.eventDate);
    }

    // cek double booking di frontend (kecuali yang sudah rejected)
    const hasBookingSameDay = bookings.some((b) => {
      const existing = new Date(b.eventDate);
      return isSameDay(existing, eventDate) && b.status !== "rejected";
    });

    if (hasBookingSameDay) {
      alert("Tanggal ini sudah memiliki booking. Pilih tanggal lain.");
      return;
    }

    const newBooking: Booking = {
      customerName: form.customerName,
      eventDate: eventDate.toISOString(),
      packageId: form.packageId,
      status: "pending",
    };

    console.log("➡️ Emit create_booking:", newBooking);
    socket.emit("create_booking", newBooking);

    setForm({
      customerName: "",
      eventDate: "",
      eventTime: "",
      packageId: "",
    });
  };

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>Halaman Customer – Pemesanan Dekorasi Floraless</h1>
      <p style={{ marginBottom: 16 }}>{status}</p>

      {/* FORM PEMESANAN */}
      <section
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 16,
          marginBottom: 24,
        }}
      >
        <h2>Form Pemesanan Dekorasi</h2>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginTop: 12,
          }}
        >
          <div style={{ gridColumn: "1 / span 2" }}>
            <label>
              Nama Pemesan
              <input
                type="text"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                placeholder="Contoh: Ibu Maria"
                style={{ width: "100%", padding: 8, marginTop: 4 }}
              />
            </label>
          </div>

          <div>
            <label>
              Tanggal Acara
              <input
                type="date"
                name="eventDate"
                value={form.eventDate}
                onChange={handleChange}
                style={{ width: "100%", padding: 8, marginTop: 4 }}
              />
            </label>
          </div>

          <div>
            <label>
              Jam Acara (opsional)
              <input
                type="time"
                name="eventTime"
                value={form.eventTime}
                onChange={handleChange}
                style={{ width: "100%", padding: 8, marginTop: 4 }}
              />
            </label>
          </div>

          <div style={{ gridColumn: "1 / span 2" }}>
            <label>
              Paket Dekorasi
              <input
                type="text"
                name="packageId"
                value={form.packageId}
                onChange={handleChange}
                placeholder="Contoh: Paket Gereja Gold"
                style={{ width: "100%", padding: 8, marginTop: 4 }}
              />
            </label>
          </div>

          <div style={{ gridColumn: "1 / span 2", textAlign: "right" }}>
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                borderRadius: 6,
                border: "none",
                backgroundColor: "#0066AE",
                color: "white",
                cursor: "pointer",
              }}
            >
              Kirim Pemesanan
            </button>
          </div>
        </form>
      </section>

      {/* LIST BOOKING */}
      <section style={{ marginBottom: 24 }}>
        <h2>Booking Kamu & Booking Lain (Real-Time):</h2>
        {bookings.length === 0 ? (
          <p>Belum ada booking.</p>
        ) : (
          <ul>
            {bookings.map((b, idx) => (
              <li key={b._id ?? idx}>
                {b.customerName} –{" "}
                {new Date(b.eventDate).toLocaleString()} – {b.status} –{" "}
                {b.packageId}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* KALENDER */}
      <FullCalendarView bookings={bookings.filter(b => b.status !== "rejected")} />
    </main>
  );
}
