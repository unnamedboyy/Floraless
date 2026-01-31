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
  .then(async () => {
    console.log("✅ MongoDB connected");
    await seedOnce();
  })
  .catch((err) =>
    console.error("❌ MongoDB connection error:", err.message)
  );

// ===== Socket.IO Setup =====
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PATCH"],
    credentials: true,
  },
});

function getDayRange(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return { start: null, end: null };
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
  return { start, end };
}

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

      const chatDoc = await Chat.create({
        room: roomId,
        sender_role,
        admin: sender_role === "admin" ? adminId : undefined,
        pelanggan: sender_role === "pelanggan" ? pelangganId : undefined,
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

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Floraless API is running" });
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

    io.to("calendar_room").emit("ticket_created", ticket);

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

app.patch("/api/tickets/:id/cancel", async (req, res) => {
  try {
    const id = req.params.id;

    const ticket = await TicketPemesanan.findById(id);
    if (!ticket) return res.status(404).json({ message: "Ticket tidak ditemukan" });

    ticket.status = "rejected";
    if (Array.isArray(ticket.jadwal)) {
      ticket.jadwal = ticket.jadwal.map((j) => ({
        ...j,
        status_tanggal: "cancelled",
      }));
    }
    await ticket.save();

    await LogAktivitas.create({
      ticket: ticket._id,
      info: "Ticket dibatalkan/selesai (status rejected, jadwal cancelled).",
    });

    io.to("calendar_room").emit("ticket_cancelled", ticket);

    res.json(ticket);
  } catch (err) {
    console.error("❌ cancel ticket:", err.message);
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
