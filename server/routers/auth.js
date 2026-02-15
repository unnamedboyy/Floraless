const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const Admin = require("../models/Admin");
const Pelanggan = require("../models/Pelanggan");
const { signToken } = require("../utils/jwt");

/**
 * LOGIN (admin atau pelanggan)
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ message: "username & password wajib" });
    }

    // cek admin dulu
    let user = await Admin.findOne({ username });
    let role = "admin";

    if (!user) {
      user = await Pelanggan.findOne({ username });
      role = "pelanggan";
    }

    if (!user) {
      return res.status(401).json({ message: "User tidak ditemukan" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Password salah" });
    }

    const token = signToken({
      id: user._id,
      role,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true kalau HTTPS
      sameSite: "lax",
    });

    res.json({
      message: "Login berhasil",
      role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * LOGOUT
 */
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout berhasil" });
});

module.exports = router;
