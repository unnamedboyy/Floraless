import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import User from "./models/user.js";
import Pelanggan from "./models/pelanggan.js";
import Pegawai from "./models/pegawai.js";
import Admin from "./models/admin.js";
import Layanan from "./models/layanan.js";
import Ticket from "./models/ticket.js";
import DetailTicket from "./models/detailTicket.js";
import Jadwal from "./models/jadwal.js";
import Payment from "./models/payment.js";
import Voucher from "./models/voucher.js";
import Cashback from "./models/cashbackClaim.js";

dotenv.config();
await mongoose.connect(process.env.MONGODB_URI);

console.log("DB NAME:", mongoose.connection.name);
console.log("✅ DB Connected");

/* ================= RESET DB ================= */
const collections = await mongoose.connection.db.collections();
for (let c of collections) {
  await c.deleteMany({});
}
console.log("🧹 DB Cleared");

/* ================= HELPER ================= */

const hash = await bcrypt.hash("123456", 10);

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomTicketStatus = () =>
  random(["pending", "approved", "in_progress", "done"]);

const randomPaymentStatus = () =>
  random(["pending", "approved", "rejected"]);

/* ================= ADMIN ================= */

const adminUser = await User.create({
  username: "admin",
  password: hash,
  role: "admin",
});

await Admin.create({
  userId: adminUser._id,
  nama: "Admin Utama",
});

/* ================= PEGAWAI ================= */

const pegawais = [];

for (let i = 1; i <= 8; i++) {
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

const pelanggans = [];

for (let i = 1; i <= 25; i++) {
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

const layananList = await Layanan.insertMany([
  { nama: "Wedding Basic", harga: 5000000 },
  { nama: "Wedding Premium", harga: 10000000 },
  { nama: "Engagement", harga: 3000000 },
  { nama: "Birthday Party", harga: 2000000 },
]);

/* ================= TICKETS ================= */

for (let i = 0; i < 100; i++) {
  const pelanggan = random(pelanggans);
  const pegawai = random(pegawais);
  const layanan = random(layananList);

  const status = randomTicketStatus();

  const ticket = await Ticket.create({
    pelangganId: pelanggan._id,
    layananId: layanan._id,
    pegawaiId: pegawai._id,
    status,
  });

  const tanggal = new Date(
    2026,
    Math.floor(Math.random() * 3), // Jan–Mar
    Math.floor(Math.random() * 28) + 1
  );

  await DetailTicket.create({
    ticketId: ticket._id,
    nama_acara: `Event ${i + 1}`,
    lokasi: "Jakarta",
    tanggal_acara: tanggal,
  });

  await Jadwal.create({
    ticketId: ticket._id,
    pegawaiId: pegawai._id,
    tanggal_acara: tanggal,
    status: random(["booked", "ongoing", "done"]),
  });

  /* ================= PAYMENT ================= */

  const harga = layanan.harga;

  await Payment.create({
    ticketId: ticket._id,
    tipe: "DP1",
    jumlah: harga * 0.2,
    status: randomPaymentStatus(),
  });

  if (Math.random() > 0.3) {
    await Payment.create({
      ticketId: ticket._id,
      tipe: "DP2",
      jumlah: harga * 0.3,
      status: randomPaymentStatus(),
    });
  }

  if (Math.random() > 0.5) {
    await Payment.create({
      ticketId: ticket._id,
      tipe: "PELUNASAN",
      jumlah: harga * 0.5,
      status: randomPaymentStatus(),
    });
  }

  /* ================= VOUCHER ================= */

  if (Math.random() > 0.6) {
    const voucher = await Voucher.create({
      code: `VC-${Math.random().toString(36).slice(2, 8)}`,
      pelangganId: pelanggan._id,
      amount: 50000,
      expiredAt: new Date(2026, 11, 31),
    });

    /* ================= CASHBACK ================= */

    if (Math.random() > 0.5) {
      await Cashback.create({
        voucherId: voucher._id,
        pelangganId: pelanggan._id,
        kode_voucher: voucher.code, // 🔥 FIXED
        nama_rekening: "Budi",
        nomor_rekening: "12345678",
        bank: "BCA",
        status: random(["pending", "approved", "rejected"]),
      });
    }
  }
}

console.log("🚀 SEEDING SELESAI");
process.exit();