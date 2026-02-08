require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const { seedOnce } = require("./seed");

const app = express();
const server = http.createServer(app);

// =======================
// ENV
// =======================
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/floraless_db";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// =======================
// MIDDLEWARE
// =======================
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());

// =======================
// ROUTES
// =======================
const chatRoutes = require("./routers/chat");
const pelangganRoutes = require("./routers/pelanggan");
const layananRoutes = require("./routers/layanan");
const ticketRoutes = require("./routers/ticket");

app.use("/api/chat", chatRoutes);
app.use("/api/pelanggan", pelangganRoutes);
app.use("/api/layanan", layananRoutes);
app.use("/api/tickets", ticketRoutes);

// =======================
// MONGODB
// =======================
mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");
    await seedOnce();
  })
  .catch((err) =>
    console.error("❌ MongoDB connection error:", err.message)
  );

// =======================
// SOCKET.IO
// =======================
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PATCH"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  // ===== Calendar =====
  socket.on("join_calendar", () => {
    socket.join("calendar_room");
  });

  // ===== Chat =====
  socket.on("join_room", ({ roomId }) => {
    if (!roomId) return;
    socket.join(`room_${roomId}`);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Socket disconnected:", socket.id, "reason:", reason);
  });
});

// =======================
// HEALTH CHECK
// =======================
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Floraless API is running" });
});

// =======================
// START SERVER
// =======================
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});

// =======================
// EXPORT IO (PENTING)
// =======================
module.exports = { io };
