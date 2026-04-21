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
import HistoryStatus from "./models/historyStatus.js";
import Payment from "./models/payment.js";

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);
console.log("✅ DB Connected");

// RESET DB
const collections = await mongoose.connection.db.collections();
for (let c of collections) {
  await c.deleteMany({});
}
console.log("🧹 DB Cleared");

// HASH PASSWORD
const hash = await bcrypt.hash("123456", 10);

// CREATE ADMIN
const adminUser = await User.create({
  username: "admin",
  password: hash,
  role: "admin"
});

await Admin.create({
  userId: adminUser._id,
  nama: "Admin Utama",
  no_telp: "0811111111"
});

// CREATE PEGAWAI (5)
const pegawais = [];

for (let i = 1; i <= 5; i++) {
  const user = await User.create({
    username: `pegawai${i}`,
    password: hash,
    role: "pegawai"
  });

  const pegawai = await Pegawai.create({
    userId: user._id,
    nama: `Pegawai ${i}`,
    no_telp: `08222${i}${i}${i}${i}`
  });

  pegawais.push(pegawai);
}

// CREATE PELANGGAN (10)
const pelanggans = [];

for (let i = 1; i <= 10; i++) {
  const user = await User.create({
    username: `pelanggan${i}`,
    password: hash,
    role: "pelanggan"
  });

  const pelanggan = await Pelanggan.create({
    userId: user._id,
    nama: `Pelanggan ${i}`,
    no_telp: `08333${i}${i}${i}${i}`
  });

  pelanggans.push(pelanggan);
}

// CREATE LAYANAN
const layananList = [];

const layananData = [
  { nama: "Wedding Basic", harga: 5000000 },
  { nama: "Wedding Premium", harga: 10000000 },
  { nama: "Engagement", harga: 3000000 },
  { nama: "Birthday Party", harga: 2000000 }
];

for (let data of layananData) {
  const layanan = await Layanan.create(data);
  layananList.push(layanan);
}

// CREATE TICKETS (20)
const tickets = [];

for (let i = 0; i < 20; i++) {
  const pelanggan = pelanggans[i % pelanggans.length];
  const layanan = layananList[i % layananList.length];
  const pegawai = pegawais[i % pegawais.length];

  const ticket = await Ticket.create({
    pelangganId: pelanggan._id,
    layananId: layanan._id,
    pegawaiId: pegawai._id,
    status: "approved"
  });

  tickets.push(ticket);

  const tanggal = new Date(2026, 4, i + 1);

  // DETAIL
  await DetailTicket.create({
    ticketId: ticket._id,
    nama_acara: `Event ${i + 1}`,
    lokasi: "Jakarta",
    tanggal_acara: tanggal
  });

  // JADWAL
  await Jadwal.create({
    ticketId: ticket._id,
    tanggal_acara: tanggal
  });

  // HISTORY
  await HistoryStatus.create({
    ticketId: ticket._id,
    status: "approved",
    keterangan: "Seed data"
  });


  // PAYMENT (random progress)
  const harga = layanan.harga;

  // DP1
  const dp1 = await Payment.create({
    ticketId: ticket._id,
    tipe: "DP1",
    jumlah: harga * 0.2,
    status: "approved",
    approvedBy: pegawai._id,
    approvedAt: new Date()
  });

  // random apakah lanjut DP2
  if (i % 2 === 0) {
    const dp2 = await Payment.create({
      ticketId: ticket._id,
      tipe: "DP2",
      jumlah: harga * 0.3,
      status: "approved",
      approvedBy: pegawai._id,
      approvedAt: new Date()
    });

    // random pelunasan
    if (i % 3 === 0) {
      await Payment.create({
        ticketId: ticket._id,
        tipe: "PELUNASAN",
        jumlah: harga * 0.5,
        status: "approved",
        approvedBy: pegawai._id,
        approvedAt: new Date()
      });

      ticket.status = "in_progress";
      await ticket.save();
    }
  }
}

// DONE
console.log("🚀 SEEDING SELESAI");
process.exit();