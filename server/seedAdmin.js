// seed.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import User from "./models/user.js";
import Admin from "./models/admin.js"

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

// console.log("🧹 Clearing database...");

// const collections =
//   await mongoose.connection.db.collections();

// for (const collection of collections) {
//   await collection.deleteMany({});
// }

// console.log("✅ Database cleared");

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

console.log(
  "🚀 SEEDING SELESAI"
);

process.exit();