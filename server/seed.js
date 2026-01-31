const Admin = require("./models/Admin");
const Pelanggan = require("./models/Pelanggan");
const Layanan = require("./models/Layanan");
const TicketPemesanan = require("./models/TicketPemesanan");
const RoomChat = require("./models/RoomChat");
const Chat = require("./models/Chat");
const LogAktivitas = require("./models/LogAktivitas");

async function seedOnce() {
  console.log("🌱 Checking database for seeding...");

  /* =========================
     ADMIN
     ========================= */
  let admin = await Admin.findOne();
  if (!admin) {
    admin = await Admin.create({
      nama: "Admin Floraless",
      email: "admin@floraless.test",
      no_telepon: "081234567890",
      username: "admin",
      password: "admin123",
      role: "admin",
    });
    console.log("🌱 Seeded: Admin");
  }

  /* =========================
     PELANGGAN
     ========================= */
  let pelanggan = await Pelanggan.findOne();
  if (!pelanggan) {
    pelanggan = await Pelanggan.create({
      nama: "Customer Dummy",
      email: "customer@floraless.test",
      no_telepon: "089999999999",
      username: "customer",
      password: "customer123",
    });
    console.log("🌱 Seeded: Pelanggan");
  }

  /* =========================
     LAYANAN
     ========================= */
  const layananCount = await Layanan.countDocuments();
  let layananList = [];
  if (layananCount === 0) {
    layananList = await Layanan.insertMany([
      {
        nama_layanan: "Dekorasi Gereja Basic",
        deskripsi: "Dekorasi sederhana untuk acara gereja",
        harga: 2500000,
      },
      {
        nama_layanan: "Dekorasi Gereja Premium",
        deskripsi: "Dekorasi lengkap + bunga + lighting",
        harga: 6500000,
      },
      {
        nama_layanan: "Dekorasi Event",
        deskripsi: "Dekorasi ulang tahun, engagement, bridal shower",
        harga: 4500000,
      },
    ]);
    console.log("🌱 Seeded: Layanan (3)");
  } else {
    layananList = await Layanan.find().limit(3);
  }

  /* =========================
     TICKET PEMESANAN
     ========================= */
  const ticketCount = await TicketPemesanan.countDocuments();
  let ticket;
  if (ticketCount === 0) {
    ticket = await TicketPemesanan.create({
      pelanggan: pelanggan._id,
      admin: admin._id,
      layanan: layananList[0]._id,
      status: "pending",
      info_acara: "Acara pernikahan di gereja",
      jadwal: [
        {
          tanggal_acara: new Date(new Date().setDate(new Date().getDate() + 3)),
          status_tanggal: "booked",
          info: "Tanggal utama acara",
        },
      ],
    });
    console.log("🌱 Seeded: TicketPemesanan");
  }

  /* =========================
     ROOM CHAT
     ========================= */
  let room = await RoomChat.findOne({ pelanggan: pelanggan._id });
  if (!room) {
    room = await RoomChat.create({
      pelanggan: pelanggan._id,
    });
    console.log("🌱 Seeded: RoomChat");
  }

  /* =========================
     CHAT
     ========================= */
  const chatCount = await Chat.countDocuments({ room: room._id });
  if (chatCount === 0) {
    await Chat.insertMany([
      {
        room: room._id,
        admin: admin._id,
        sender_role: "admin",
        isi_chat: "Halo, silakan informasikan detail acara Anda.",
      },
      {
        room: room._id,
        pelanggan: pelanggan._id,
        sender_role: "pelanggan",
        isi_chat: "Baik, acara akan dilaksanakan di gereja utama.",
      },
    ]);
    console.log("🌱 Seeded: Chat (2)");
  }

  /* =========================
     LOG AKTIVITAS
     ========================= */
  if (ticket) {
    const logCount = await LogAktivitas.countDocuments({ ticket: ticket._id });
    if (logCount === 0) {
      await LogAktivitas.create({
        ticket: ticket._id,
        info: "Ticket dibuat secara otomatis untuk simulasi sistem.",
      });
      console.log("🌱 Seeded: LogAktivitas");
    }
  }

  console.log("✅ Seeding completed");
}

module.exports = { seedOnce };
