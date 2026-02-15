require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const { seedOnce } = require("./seed");

const Admin = require("./models/Admin");
const Pelanggan = require("./models/Pelanggan");
const Layanan = require("./models/Layanan");
const TicketPemesanan = require("./models/TicketPemesanan");
const RoomChat = require("./models/RoomChat");
const Chat = require("./models/Chat");
const LogAktivitas = require("./models/LogAktivitas");

const app = express();
const server = http.createServer(app);
const cookieParser = require("cookie-parser");

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
app.use(cookieParser());
app.use(express.static("public"));

app.use("/api/auth", require("./routers/auth"));

// ===== ROUTERS =====
app.use("/api/admin", require("./routers/admin"));
app.use("/api/pelanggan", require("./routers/pelanggan"));
app.use("/api/layanan", require("./routers/layanan"));
app.use("/api/ticket", require("./routers/ticket_pemesanan"));
app.use("/api/jadwal", require("./routers/jadwal"));
app.use("/api/log", require("./routers/log_aktivitas"));
app.use("/api/room-chat", require("./routers/room_chat"));
app.use("/api/chat", require("./routers/chat"));


// ===== MongoDB Connection =====
mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");
    await seedOnce();
  })
  .catch((err) =>
    console.error("❌ MongoDB connection error:", err.message)
  );

// ===== Socket.IO Setup =====
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PATCH"],
    credentials: true,
  },
});

app.set("io", io);


/**
 * =========================
 * SOCKET AUTH MIDDLEWARE
 * =========================
 */
io.use((socket, next) => {
  try {
    const rawCookie = socket.handshake.headers.cookie;

    if (!rawCookie) {
      return next(new Error("Unauthorized: No cookie"));
    }

    const parsed = cookie.parse(rawCookie);
    const token = parsed.token;

    if (!token) {
      return next(new Error("Unauthorized: No token"));
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecretkey"
    );

    socket.user = decoded; // attach user ke socket

    next();
  } catch (err) {
    next(new Error("Unauthorized: Invalid token"));
  }
});


/**
 * =========================
 * SOCKET CONNECTION
 * =========================
 */
io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);
  console.log("👤 User:", socket.user);

  /**
   * JOIN CALENDAR ROOM
   */
  socket.on("join_calendar", () => {
    socket.join("calendar_room");
  });

  /**
   * JOIN CHAT ROOM (SECURE)
   */
  socket.on("join_room", async ({ roomId }) => {
    if (!roomId) return;

    // pelanggan hanya boleh join room miliknya
    if (socket.user.role === "pelanggan") {
      const room = await RoomChat.findById(roomId);

      if (!room || room.pelanggan.toString() !== socket.user.id) {
        return socket.emit("error_message", "Unauthorized room access");
      }
    }

    socket.join(`room_${roomId}`);
  });

  /**
   * SEND CHAT (SERVER TENTUKAN SENDER)
   */
  socket.on("send_chat", async (payload) => {
    try {
      const { roomId, isi_chat } = payload || {};
      if (!roomId || !isi_chat) return;

      const chatDoc = await Chat.create({
        room: roomId,
        sender_role: socket.user.role,
        admin:
          socket.user.role === "admin" ? socket.user.id : undefined,
        pelanggan:
          socket.user.role === "pelanggan" ? socket.user.id : undefined,
        isi_chat,
      });

      io.to(`room_${roomId}`).emit("chat_new", chatDoc);
    } catch (err) {
      console.error("❌ send_chat error:", err.message);
      socket.emit("error_message", "Gagal mengirim chat.");
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Socket disconnected:", socket.id, "reason:", reason);
  });
});


function getDayRange(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return { start: null, end: null };
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
  return { start, end };
}

// io.on("connection", (socket) => {
//   console.log("🔌 Socket connected:", socket.id);

//   socket.on("join_calendar", () => {
//     socket.join("calendar_room");
//   });

//   socket.on("join_room", ({ roomId }) => {
//     if (!roomId) return;
//     socket.join(`room_${roomId}`);
//   });

//   socket.on("send_chat", async (payload) => {
//     try {
//       const { roomId, sender_role, adminId, pelangganId, isi_chat } = payload || {};
//       if (!roomId || !sender_role || !isi_chat) return;

//       const chatDoc = await Chat.create({
//         room: roomId,
//         sender_role,
//         admin: sender_role === "admin" ? adminId : undefined,
//         pelanggan: sender_role === "pelanggan" ? pelangganId : undefined,
//         isi_chat,
//       });

//       io.to(`room_${roomId}`).emit("chat_new", chatDoc);
//     } catch (err) {
//       console.error("❌ send_chat error:", err.message);
//       socket.emit("error_message", "Gagal mengirim chat.");
//     }
//   });

//   socket.on("disconnect", (reason) => {
//     console.log("❌ Socket disconnected:", socket.id, "reason:", reason);
//   });
// });

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Floraless API is running" });
});

app.get("/test-login", (req, res) => {
  const token = jwt.sign(
    { id: "admin123", role: "admin" },
    process.env.JWT_SECRET || "supersecretkey"
  );

  res.cookie("token", token, {
    httpOnly: false, // sementara untuk test
  });

  res.send("Test cookie set");
});

app.post("/api/pelanggan/register", async (req, res) => {
  try {
    const { nama, email, no_telepon, username, password } = req.body || {};
    if (!nama || !email || !username || !password) {
      return res.status(400).json({ message: "Field wajib: nama, email, username, password" });
    }

    const pelanggan = await Pelanggan.create({
      nama,
      email,
      no_telepon,
      username,
      password,
    });

    res.json(pelanggan);
  } catch (err) {
    console.error("❌ pelanggan register:", err.message);
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/admin/register", async (req, res) => {
  try {
    const { nama, email, no_telepon, username, password, role } = req.body || {};
    if (!nama || !email || !username || !password) {
      return res.status(400).json({ message: "Field wajib: nama, email, username, password" });
    }

    const admin = await Admin.create({
      nama,
      email,
      no_telepon,
      username,
      password,
      role: role || "admin",
    });

    res.json(admin);
  } catch (err) {
    console.error("❌ admin register:", err.message);
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/layanan", async (req, res) => {
  try {
    const { nama_layanan, deskripsi, harga } = req.body || {};
    if (!nama_layanan || harga == null) {
      return res.status(400).json({ message: "Field wajib: nama_layanan, harga" });
    }

    const layanan = await Layanan.create({
      nama_layanan,
      deskripsi,
      harga: Number(harga),
    });

    res.json(layanan);
  } catch (err) {
    console.error("❌ create layanan:", err.message);
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/layanan", async (req, res) => {
  try {
    const data = await Layanan.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/tickets", async (req, res) => {
  try {
    const { pelangganId, layananId, tanggal_acara, info_acara, adminId } = req.body || {};
    if (!pelangganId || !layananId || !tanggal_acara) {
      return res.status(400).json({ message: "Field wajib: pelangganId, layananId, tanggal_acara" });
    }

    const { start, end } = getDayRange(tanggal_acara);
    if (!start || !end) {
      return res.status(400).json({ message: "tanggal_acara tidak valid" });
    }

    const conflict = await TicketPemesanan.findOne({
      "jadwal.tanggal_acara": { $gte: start, $lt: end },
      status: { $ne: "rejected" },
    });

    if (conflict) {
      return res.status(409).json({ message: "Tanggal sudah dibooking (conflict)." });
    }

    const ticket = await TicketPemesanan.create({
      pelanggan: pelangganId,
      layanan: layananId,
      admin: adminId,
      status: "pending",
      info_acara: info_acara || "",
      jadwal: [
        {
          tanggal_acara: new Date(tanggal_acara),
          status_tanggal: "booked",
          info: "",
        },
      ],
    });

    await LogAktivitas.create({
      ticket: ticket._id,
      info: `Ticket dibuat (pending) untuk tanggal ${new Date(tanggal_acara).toISOString()}`,
    });

    io.to("calendar_room").emit("calendar_update", {
      type: "created",
      ticketId: ticket._id,
      tanggal_acara: new Date(tanggal_acara),
    });


    res.json(ticket);
  } catch (err) {
    console.error("❌ create ticket:", err.message);
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/tickets", async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const data = await TicketPemesanan.find(filter)
      .populate("pelanggan")
      .populate("admin")
      .populate("layanan")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    console.error("❌ get tickets:", err.message);
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/rooms/for/:pelangganId", async (req, res) => {
  try {
    const { pelangganId } = req.params;

    let room = await RoomChat.findOne({ pelanggan: pelangganId });
    if (!room) {
      room = await RoomChat.create({ pelanggan: pelangganId });
    }
    res.json(room);
  } catch (err) {
    console.error("❌ room for pelanggan:", err.message);
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/chats", async (req, res) => {
  try {
    const { roomId } = req.query;
    if (!roomId) return res.status(400).json({ message: "roomId wajib" });

    const chats = await Chat.find({ room: roomId })
      .sort({ createdAt: 1 })
      .populate("admin")
      .populate("pelanggan");

    res.json(chats);
  } catch (err) {
    console.error("❌ get chats:", err.message);
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/chats", async (req, res) => {
  try {
    const { roomId, sender_role, adminId, pelangganId, isi_chat } = req.body || {};
    if (!roomId || !sender_role || !isi_chat) {
      return res.status(400).json({ message: "roomId, sender_role, isi_chat wajib" });
    }

    const chatDoc = await Chat.create({
      room: roomId,
      sender_role,
      admin: sender_role === "admin" ? adminId : undefined,
      pelanggan: sender_role === "pelanggan" ? pelangganId : undefined,
      isi_chat,
    });

    io.to(`room_${roomId}`).emit("chat_new", chatDoc);

    res.json(chatDoc);
  } catch (err) {
    console.error("❌ create chat:", err.message);
    res.status(500).json({ message: err.message });
  }
});


app.get("/api/tickets/:id/logs", async (req, res) => {
  try {
    const { id } = req.params;
    const logs = await LogAktivitas.find({ ticket: id }).sort({ createdAt: 1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
