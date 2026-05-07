import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

/* ================= MODELS ================= */

import User from "./models/user.js";

import Admin from "./models/admin.js";
import Pegawai from "./models/pegawai.js";
import Pelanggan from "./models/pelanggan.js";

import Layanan from "./models/layanan.js";

import Ticket from "./models/ticket.js";
import DetailTicket from "./models/detailTicket.js";

import Jadwal from "./models/jadwal.js";

import Payment from "./models/payment.js";

import Voucher from "./models/voucher.js";
import Cashback from "./models/cashbackClaim.js";

import Review from "./models/review.js";

import Portfolio from "./models/portfolio.js";
import FotoPortfolio from "./models/fotoPortfolio.js";

import LogActivity from "./models/logAktivitas.js";

/* ================= CONFIG ================= */

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

console.log("✅ Mongo Connected");
console.log("DB:", mongoose.connection.name);

/* ================= RESET DB ================= */

console.log("🧹 Clearing database...");

await Promise.all([
  User.deleteMany({}),
  Admin.deleteMany({}),
  Pegawai.deleteMany({}),
  Pelanggan.deleteMany({}),
  Layanan.deleteMany({}),
  Ticket.deleteMany({}),
  DetailTicket.deleteMany({}),
  Jadwal.deleteMany({}),
  Payment.deleteMany({}),
  Voucher.deleteMany({}),
  Cashback.deleteMany({}),
  Review.deleteMany({}),
  Portfolio.deleteMany({}),
  FotoPortfolio.deleteMany({}),
  LogActivity.deleteMany({}),
]);

console.log("✅ Database cleared");

/* ================= HELPERS ================= */

const hash = await bcrypt.hash("123456", 10);

const random = (arr) =>
  arr[Math.floor(Math.random() * arr.length)];

const randomDate = () => {
  return new Date(
    2026,
    Math.floor(Math.random() * 12),
    Math.floor(Math.random() * 28) + 1
  );
};

const layananImages = [
  "/services/wedding-1.jpg",
  "/services/wedding-2.jpg",
  "/services/church-1.jpg",
  "/services/engagement-1.jpg",
];

const portfolioImages = [
  "/portfolio/1.jpg",
  "/portfolio/2.jpg",
  "/portfolio/3.jpg",
  "/portfolio/4.jpg",
  "/portfolio/5.jpg",
  "/portfolio/6.jpg",
];

const reviewComments = [
  "Dekorasi sangat elegan dan memuaskan",
  "Pelayanan sangat profesional",
  "Tim datang tepat waktu dan hasil bagus",
  "Acara jadi lebih berkesan",
  "Komunikasi admin sangat responsif",
  "Dekorasi sesuai request",
  "Sangat recommended",
  "Semua tamu memuji dekorasinya",
  "Penataan bunga sangat indah",
  "Terima kasih Floraless",
];

const ticketStatuses = [
  "pending",
  "approved",
  "in_progress",
  "done",
];

const paymentStatuses = [
  "pending",
  "approved",
  "rejected",
];

const jadwalStatuses = [
  "booked",
  "ongoing",
  "done",
];

/* ================= ADMIN ================= */

console.log("👑 Creating admin...");

const adminUser = await User.create({
  username: "admin",
  password: hash,
  role: "admin",
});

const admin = await Admin.create({
  userId: adminUser._id,
  nama: "Admin Utama",
});

/* ================= PEGAWAI ================= */

console.log("👷 Creating pegawai...");

const pegawais = [];

for (let i = 1; i <= 10; i++) {

  const user = await User.create({
    username: `pegawai${i}`,
    password: hash,
    role: "pegawai",
  });

  const pegawai = await Pegawai.create({
    userId: user._id,
    nama: `Pegawai ${i}`,
  });

  pegawais.push(pegawai);
}

/* ================= PELANGGAN ================= */

console.log("🧑 Creating pelanggan...");

const pelanggans = [];

for (let i = 1; i <= 50; i++) {

  const user = await User.create({
    username: `pelanggan${i}`,
    password: hash,
    role: "pelanggan",
  });

  const pelanggan = await Pelanggan.create({
    userId: user._id,
    nama: `Pelanggan ${i}`,
  });

  pelanggans.push(pelanggan);
}

/* ================= LAYANAN ================= */

console.log("🎨 Creating layanan...");

const layananList = await Layanan.insertMany([
  {
    nama_layanan: "Wedding Basic",
    harga: 5000000,
    gambar: layananImages[0],
    deskripsi:
      "Dekorasi wedding sederhana elegan\nFresh flower\nBackdrop modern\nLighting",
  },

  {
    nama_layanan: "Wedding Premium",
    harga: 12000000,
    gambar: layananImages[1],
    deskripsi:
      "Dekorasi premium luxury\nPremium flower\nFull lighting\nVIP stage",
  },

  {
    nama_layanan: "Engagement",
    harga: 4000000,
    gambar: layananImages[2],
    deskripsi:
      "Dekorasi engagement modern\nMini stage\nFresh flower",
  },

  {
    nama_layanan: "Birthday Party",
    harga: 3000000,
    gambar: layananImages[3],
    deskripsi:
      "Dekorasi ulang tahun\nCustom backdrop\nBalloon setup",
  },
]);

/* ================= PORTFOLIO ================= */

console.log("🖼 Creating portfolios...");

for (let i = 1; i <= 25; i++) {

  const portfolio = await Portfolio.create({
    title: `Portfolio ${i}`,
    category: random([
      "Wedding",
      "Engagement",
      "Birthday",
      "Church"
    ]),
    description:
      "Dekorasi elegan dengan konsep modern dan premium.",
    thumbnail: random(portfolioImages),
  });

  for (let j = 0; j < 3; j++) {

    await FotoPortfolio.create({
      portfolioId: portfolio._id,
      url: random(portfolioImages),
    });

  }
}

/* ================= TICKETS ================= */

console.log("🎫 Creating tickets...");

for (let i = 1; i <= 200; i++) {

  const pelanggan = random(pelanggans);

  const pegawai = random(pegawais);

  const layanan = random(layananList);

  const status = random(ticketStatuses);

  const tanggal = randomDate();

  const ticket = await Ticket.create({
    pelangganId: pelanggan._id,
    pegawaiId: pegawai._id,
    layananId: layanan._id,
    status,
  });

  /* ================= DETAIL TICKET ================= */

  await DetailTicket.create({
    ticketId: ticket._id,
    nama_acara: `Event ${i}`,
    lokasi: random([
      "Jakarta",
      "Bandung",
      "Yogyakarta",
      "Surabaya",
      "Bali",
    ]),
    tanggal_acara: tanggal,
  });

  /* ================= JADWAL ================= */

  await Jadwal.create({
    ticketId: ticket._id,
    pegawaiId: pegawai._id,
    tanggal_acara: tanggal,
    status:
      status === "done"
        ? "done"
        : random(jadwalStatuses),
  });

  /* ================= PAYMENT ================= */

  const paymentApproved =
    status === "done";

  await Payment.create({
    ticketId: ticket._id,
    tipe: "DP1",
    jumlah: layanan.harga * 0.2,
    status:
      paymentApproved
        ? "approved"
        : random(paymentStatuses),
  });

  await Payment.create({
    ticketId: ticket._id,
    tipe: "DP2",
    jumlah: layanan.harga * 0.3,
    status:
      paymentApproved
        ? "approved"
        : random(paymentStatuses),
  });

  await Payment.create({
    ticketId: ticket._id,
    tipe: "PELUNASAN",
    jumlah: layanan.harga * 0.5,
    status:
      paymentApproved
        ? "approved"
        : random(paymentStatuses),
  });

  /* ================= REVIEW ================= */

  if (
    status === "done" &&
    Math.random() > 0.35
  ) {

    await Review.create({
      ticketId: ticket._id,
      pelangganId: pelanggan._id,
      rating: random([4, 5]),
      komentar: random(reviewComments),
      isActive: Math.random() > 0.1,
    });

  }

  /* ================= VOUCHER ================= */

  if (Math.random() > 0.5) {

    const voucher = await Voucher.create({
      code:
        "VC-" +
        Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase(),

      pelangganId: pelanggan._id,

      amount: random([
        50000,
        75000,
        100000,
      ]),

      expiredAt: new Date(
        2026,
        11,
        31
      ),
    });

    /* ================= CASHBACK ================= */

    if (Math.random() > 0.4) {

      await Cashback.create({
        voucherId: voucher._id,
        pelangganId: pelanggan._id,
        kode_voucher: voucher.code,
        nama_rekening: pelanggan.nama,
        nomor_rekening:
          "1234567890",
        bank: random([
          "BCA",
          "BRI",
          "BNI",
          "Mandiri",
        ]),
        status: random([
          "pending",
          "approved",
          "rejected",
        ]),
      });

    }
  }

  /* ================= LOG ACTIVITY ================= */

  await LogActivity.create({
    userId: adminUser._id,
    ticketId: ticket._id,
    action: random([
      "CREATE_TICKET",
      "VERIFY_PAYMENT",
      "ASSIGN_PEGAWAI",
      "CREATE_REVIEW",
      "UPDATE_TICKET",
    ]),
    meta: {},
    description:
      "System generated activity",
  });
}

/* ================= DONE ================= */

console.log("🚀 SEEDING COMPLETED");
console.log("👑 Admin Login");
console.log("username: admin");
console.log("password: 123456");

process.exit();