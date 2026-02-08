require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

// ===== Models =====
const Admin = require("./models/Admin");
const Pelanggan = require("./models/Pelanggan");
const Layanan = require("./models/Layanan");
const TicketPemesanan = require("./models/TicketPemesanan");
const RoomChat = require("./models/RoomChat");
const Chat = require("./models/Chat");
const LogAktivitas = require("./models/LogAktivitas");
const CalendarBlock = require("./models/CalendarBlock");

// ===== Routers =====
const bookingRoutes = require("./routers/booking");
const calendarBlockRoutes = require("./routers/calendarBlock");

// ===== App & Server =====
const app = express();
const server = http.createServer(app);

// ===== ENV =====
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/floraless_db";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// ===== Middleware (WAJIB URUTANNYA) =====
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

// ===== Socket.IO =====
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PATCH"],
    credentials: true,
  },
});

// inject io ke request (supaya router bisa emit)
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ===== ROUTES =====
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Floraless API running 🚀" });
});

app.use("/api/calendar", calendarBlockRoutes);
app.use("/api/booking", bookingRoutes);

// ===== SOCKET EVENTS =====
io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  socket.on("join_calendar", () => {
    socket.join("calendar_room");
  });

  socket.on("join_room", ({ roomId }) => {
    if (!roomId) return;
    socket.join(`room_${roomId}`);
  });

  socket.on("send_chat", async (payload) => {
    try {
      const { roomId, sender_role, adminId, pelangganId, isi_chat } = payload || {};
      if (!roomId || !sender_role || !isi_chat) return;

      const chat = await Chat.create({
        room: roomId,
        sender_role,
        admin: sender_role === "admin" ? adminId : undefined,
        pelanggan: sender_role === "pelanggan" ? pelangganId : undefined,
        isi_chat,
      });

      io.to(`room_${roomId}`).emit("chat_new", chat);
    } catch (err) {
      console.error("❌ send_chat:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// ===== MongoDB =====
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB error:", err.message);
  });

// ===== START SERVER =====
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
