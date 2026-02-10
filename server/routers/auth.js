const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const Pelanggan = require("../models/Pelanggan");
const { signToken } = require("../utils/jwt");

/**
 * POST /api/auth/login
 * login admin / pelanggan
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username dan password wajib" });
  }

  // 1️⃣ cek ADMIN dulu
  let user = await Admin.findOne({ username });
  let role = "admin";

  // 2️⃣ kalau bukan admin, cek PELANGGAN
  if (!user) {
    user = await Pelanggan.findOne({ username });
    role = "pelanggan";
  }

  if (!user) {
    return res.status(401).json({ message: "User tidak ditemukan" });
  }

  // 3️⃣ cek password
  const isValid = await user.comparePassword(password);
  if (!isValid) {
    return res.status(401).json({ message: "Password salah" });
  }

  // 4️⃣ buat token
  const token = signToken({
    id: user._id,
    role,
    username: user.username,
  });

  // 5️⃣ set cookie (httpOnly)
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    message: "Login berhasil",
    role,
  });
});

module.exports = router;
