require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

const { seedOnce } = require("./seed");
const RoomChat = require("./models/RoomChat");
const Chat = require("./models/Chat");

const app = express();
const server = http.createServer(app);

// ================= ENV =================
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// ================= MIDDLEWARE =================
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// ================= ROUTERS =================
app.use("/api/auth", require("./routers/auth"));
app.use("/api/admin", require("./routers/admin"));
app.use("/api/pelanggan", require("./routers/pelanggan"));
app.use("/api/layanan", require("./routers/layanan"));
app.use("/api/ticket", require("./routers/ticket_pemesanan"));
app.use("/api/jadwal", require("./routers/jadwal"));
app.use("/api/log", require("./routers/log_aktivitas"));
app.use("/api/room-chat", require("./routers/room_chat"));
app.use("/api/chat", require("./routers/chat"));
app.use("/api/pembayaran", require("./routers/pembayaran"));
app.use("/api/testimoni", require("./routers/testimoni"));

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// ================= DATABASE =================
mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) =>
    console.error("❌ MongoDB connection error:", err.message)
  );

// ================= SOCKET =================
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    credentials: true,
  },
});

app.set("io", io);

// ===== SOCKET AUTH =====
io.use((socket, next) => {
  try {
    const rawCookie = socket.handshake.headers.cookie;
    if (!rawCookie) return next(new Error("Unauthorized"));

    const parsed = cookie.parse(rawCookie);
    const token = parsed.token;
    if (!token) return next(new Error("Unauthorized"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
});

// ================= SOCKET EVENTS =================
io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.user?.id);

  // ===== Calendar Room =====
  socket.on("join_calendar", () => {
    socket.join("calendar_room");
  });

  // ===== Join Chat Room =====
  socket.on("join_chat_room", async ({ roomId }) => {
    if (!roomId) return;

    const room = await RoomChat.findById(roomId);
    if (!room) {
      return socket.emit("chat_error", "Room tidak ditemukan");
    }

    // pelanggan hanya boleh join room miliknya
    if (
      socket.user.role === "pelanggan" &&
      room.pelanggan.toString() !== socket.user.id
    ) {
      return socket.emit("chat_error", "Unauthorized room access");
    }
    console.log("JOIN ROOM:", roomId, socket.user);
    socket.join(`room_${roomId}`);
  });

  // ===== Send Chat =====
  socket.on("chat_send", async ({ roomId, isi_chat }) => {
    try {
      if (!roomId || !isi_chat) return;

      const room = await RoomChat.findById(roomId);
      if (!room) return;

      if (
        socket.user.role === "pelanggan" &&
        room.pelanggan.toString() !== socket.user.id
      ) {
        return socket.emit("chat_error", "Unauthorized");
      }

      const chatDoc = await Chat.create({
        room: roomId,
        sender_role: socket.user.role,
        admin:
          socket.user.role === "admin" ? socket.user.id : undefined,
        pelanggan:
          socket.user.role === "pelanggan" ? socket.user.id : undefined,
        isi_chat,
      });

      // 🔥 Populate supaya frontend dapat username
      const populatedChat = await Chat.findById(chatDoc._id)
        .populate("admin", "username")
        .populate("pelanggan", "username");

      io.to(`room_${roomId}`).emit("chat_receive", populatedChat);

    } catch (err) {
      console.error("❌ chat_send error:", err.message);
      socket.emit("chat_error", "Gagal mengirim chat.");
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.user?.id);
  });
});

// ================= START SERVER =================
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});