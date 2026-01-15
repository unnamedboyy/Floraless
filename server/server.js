require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const Booking = require("./models/Booking");

const app = express();
const server = http.createServer(app);

// ENV
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/floraless_db";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// ===== Middleware =====
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());

// ===== MongoDB Connection =====
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

// ===== Socket.IO Setup =====
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PATCH"],
    credentials: true,
  },
});

// Helper: range satu hari (00:00 – 24:00)
function getDayRange(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) {
    return { start: null, end: null };
  }
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
  return { start, end };
}

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("join_calendar", () => {
    console.log(`📥 ${socket.id} join_calendar`);
    socket.join("calendar_room");
  });

  // ---- Create Booking (cek double booking dulu) ----
  socket.on("create_booking", async (data) => {
    console.log("➡️ create_booking received:", data);
    try {
      const { start, end } = getDayRange(data.eventDate);

      if (!start || !end) {
        socket.emit("error_message", "Tanggal tidak valid.");
        return;
      }

      // Cek apakah sudah ada booking di hari yang sama (kecuali yang rejected)
      const existing = await Booking.findOne({
        eventDate: { $gte: start, $lt: end },
        status: { $ne: "rejected" },
      });

      if (existing) {
        console.log("⛔ Booking conflict on date:", data.eventDate);
        socket.emit("booking_conflict", {
          message: "Tanggal ini sudah memiliki booking lain.",
          conflictBooking: existing,
        });
        return;
      }

      const newBooking = await Booking.create(data);
      console.log("📆 Booking created:", newBooking._id);

      // Broadcast ke semua client
      io.to("calendar_room").emit("booking_created", newBooking);
    } catch (err) {
      console.error("❌ Error create_booking:", err);
      socket.emit("error_message", "Gagal membuat booking.");
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Client disconnected:", socket.id, "reason:", reason);
  });
});

// ===== REST API Routes =====

// Cek API
app.get("/", (req, res) => {
  res.json({ message: "Floraless API running" });
});

// Ambil semua booking (bisa pakai query ?status=pending kalau mau)
app.get("/api/bookings", async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) {
      filter.status = status;
    }
    const bookings = await Booking.find(filter).sort({ eventDate: 1 });
    res.json(bookings);
  } catch (err) {
    console.error("❌ Error get bookings:", err);
    res.status(500).json({ message: "Error getting bookings" });
  }
});

// Admin: batalkan/selesaikan booking (set status 'rejected')
app.patch("/api/bookings/:id/cancel", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking tidak ditemukan" });
    }

    // Broadcast ke semua client untuk menghapus dari tampilan
    io.to("calendar_room").emit("booking_deleted", booking);
    res.json(booking);
  } catch (err) {
    console.error("❌ Error cancel booking:", err);
    res.status(500).json({ message: "Gagal membatalkan booking" });
  }
});

// ===== Start Server =====
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
