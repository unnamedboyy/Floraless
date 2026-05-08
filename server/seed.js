// seed.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

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
import CashbackClaim from "./models/cashbackClaim.js";
import Review from "./models/review.js";
import LogAktivitas from "./models/logAktivitas.js";

import Portfolio from "./models/portfolio.js";
import FotoPortfolio from "./models/fotoPortfolio.js";

dotenv.config();

/* ================= CONNECT ================= */

await mongoose.connect(
  process.env.MONGODB_URI
);

console.log("✅ Mongo Connected");
console.log(
  "DB:",
  mongoose.connection.name
);

/* ================= RESET DB ================= */

console.log("🧹 Clearing database...");

const collections =
  await mongoose.connection.db.collections();

for (const collection of collections) {
  await collection.deleteMany({});
}

console.log("✅ Database cleared");

/* ================= HELPERS ================= */

const hash =
  await bcrypt.hash("123456", 10);

const random = (arr) =>
  arr[
    Math.floor(
      Math.random() * arr.length
    )
  ];

const randomStatus = () =>
  random([
    "pending",
    "approved",
    "in_progress",
    "done",
  ]);

const randomPaymentStatus = () =>
  random([
    "pending",
    "approved",
    "rejected",
  ]);

const portfolioImages = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513278974582-3e1b4a4fa21f?q=80&w=1600&auto=format&fit=crop",
];

/* ================= ADMIN ================= */

console.log("👑 Creating admin...");

const adminUser =
  await User.create({
    username: "admin",
    password: hash,
    role: "admin",
  });

await Admin.create({
  userId: adminUser._id,
  nama: "Admin Floraless",
});

/* ================= PEGAWAI ================= */

console.log("👷 Creating pegawai...");

const pegawais = [];

for (let i = 1; i <= 10; i++) {

  const user =
    await User.create({
      username: `pegawai${i}`,
      password: hash,
      role: "pegawai",
    });

  const pegawai =
    await Pegawai.create({
      userId: user._id,
      nama: `Pegawai ${i}`,
      no_telp: `081234567${i}`,
    });

  pegawais.push(pegawai);
}

/* ================= PELANGGAN ================= */

console.log("🧑 Creating pelanggan...");

const pelanggans = [];

for (let i = 1; i <= 30; i++) {

  const user =
    await User.create({
      username: `pelanggan${i}`,
      password: hash,
      role: "pelanggan",
    });

  const pelanggan =
    await Pelanggan.create({
      userId: user._id,
      nama: `Pelanggan ${i}`,
      no_telp: `08223344${100 + i}`,
    });

  pelanggans.push(pelanggan);
}

/* ================= LAYANAN ================= */

console.log("🎨 Creating layanan...");

const layananList =
  await Layanan.insertMany([
    {
      nama: "Wedding Basic",
      deskripsi:
        "Paket wedding sederhana dan elegan",
      harga: 5000000,
    },
    {
      nama: "Wedding Premium",
      deskripsi:
        "Dekorasi premium ballroom",
      harga: 12000000,
    },
    {
      nama: "Holy Matrimony",
      deskripsi:
        "Dekorasi gereja modern",
      harga: 8000000,
    },
    {
      nama: "Engagement",
      deskripsi:
        "Dekorasi engagement intimate",
      harga: 4000000,
    },
    {
      nama: "Birthday Party",
      deskripsi:
        "Dekorasi ulang tahun premium",
      harga: 3500000,
    },
  ]);

/* ================= PORTFOLIO ================= */

console.log("🖼 Creating portfolios...");

for (let i = 1; i <= 25; i++) {

  const title =
    `Portfolio ${i}`;

  const slug =
    title
      .toLowerCase()
      .replaceAll(" ", "-");

  const portfolio =
    await Portfolio.create({

      title,

      slug,

      excerpt:
        "Dekorasi premium Floraless dengan konsep elegan dan modern.",

      thumbnail:
        random(portfolioImages),

      content:
        `
Floraless menghadirkan dekorasi premium dengan konsep modern, elegan, dan mewah.

Setiap detail dirancang secara profesional untuk menciptakan pengalaman acara yang berkesan dan eksklusif.
        `,

      rating:
        Math.floor(
          Math.random() * 2
        ) + 4,

      review:
        "Pelayanan sangat memuaskan dan dekorasi sangat elegan.",

      type: "manual",

      isActive: true,
    });

  for (let j = 1; j <= 6; j++) {

    await FotoPortfolio.create({

      portfolioId:
        portfolio._id,

      url: random(
        portfolioImages
      ),

      order: j,

      caption:
        `Gallery ${j}`,
    });
  }
}

/* ================= TICKETS ================= */

console.log("🎫 Creating tickets...");

for (let i = 1; i <= 100; i++) {

  const pelanggan =
    random(pelanggans);

  const pegawai =
    random(pegawais);

  const layanan =
    random(layananList);

  const status =
    randomStatus();

  const ticket =
    await Ticket.create({

      pelangganId:
        pelanggan._id,

      layananId:
        layanan._id,

      pegawaiId:
        pegawai._id,

      status,
    });

  const tanggal =
    new Date(
      2026,
      Math.floor(
        Math.random() * 12
      ),
      Math.floor(
        Math.random() * 28
      ) + 1
    );

  await DetailTicket.create({

    ticketId:
      ticket._id,

    tanggal_acara:
      tanggal,

    lokasi:
      random([
        "Jakarta",
        "Yogyakarta",
        "Bandung",
        "Surabaya",
        "Bali",
      ]),

    nama_acara:
      `Wedding Event ${i}`,

    catatan:
      "Mohon dekorasi bernuansa putih emas.",
  });

  await Jadwal.create({

    ticketId:
      ticket._id,

    pegawaiId:
      pegawai._id,

    title:
      `Decor Event ${i}`,

    lokasi:
      "Venue Utama",

    tanggal_acara:
      tanggal,

    status:
      random([
        "booked",
        "ongoing",
        "done",
      ]),
  });

  /* ================= PAYMENT ================= */

  const harga =
    layanan.harga;

  await Payment.create({

    ticketId:
      ticket._id,

    tipe: "DP1",

    jumlah:
      harga * 0.3,

    status:
      randomPaymentStatus(),

    approvedBy:
      pegawai._id,
  });

  if (Math.random() > 0.3) {

    await Payment.create({

      ticketId:
        ticket._id,

      tipe: "DP2",

      jumlah:
        harga * 0.3,

      status:
        randomPaymentStatus(),

      approvedBy:
        pegawai._id,
    });
  }

  if (Math.random() > 0.5) {

    await Payment.create({

      ticketId:
        ticket._id,

      tipe: "PELUNASAN",

      jumlah:
        harga * 0.4,

      status:
        randomPaymentStatus(),

      approvedBy:
        pegawai._id,
    });
  }

  /* ================= VOUCHER ================= */

  if (Math.random() > 0.5) {

    const voucher =
      await Voucher.create({

        code:
          `VC-${Math.random()
            .toString(36)
            .slice(2, 8)
            .toUpperCase()}`,

        pelangganId:
          pelanggan._id,

        amount: 50000,

        isUsed:
          Math.random() > 0.5,

        expiredAt:
          new Date(
            2027,
            11,
            31
          ),
      });

    /* ================= CASHBACK ================= */

    if (Math.random() > 0.5) {

      await CashbackClaim.create({

        voucherId:
          voucher._id,

        pelangganId:
          pelanggan._id,

        kode_voucher:
          voucher.code,

        nama_rekening:
          pelanggan.nama,

        nomor_rekening:
          `12345678${i}`,

        bank:
          random([
            "BCA",
            "BRI",
            "Mandiri",
            "BNI",
          ]),

        status:
          random([
            "pending",
            "approved",
            "rejected",
          ]),
      });
    }
  }

  /* ================= REVIEW ================= */

  if (
    status === "done" &&
    Math.random() > 0.3
  ) {

    await Review.create({

      ticketId:
        ticket._id,

      pelangganId:
        pelanggan._id,

      rating:
        Math.floor(
          Math.random() * 2
        ) + 4,

      komentar:
        random([
          "Dekorasi sangat elegan!",
          "Pelayanan memuaskan.",
          "Tim sangat profesional.",
          "Acara jadi sangat indah.",
          "Recommended banget.",
        ]),
    });
  }

  /* ================= LOG ================= */

  await LogAktivitas.create({

    userId:
      adminUser._id,

    ticketId:
      ticket._id,

    action:
      "CREATE_TICKET",

    description:
      `Ticket ${i} berhasil dibuat`,
  });
}

console.log(
  "🚀 SEEDING SELESAI"
);

process.exit();