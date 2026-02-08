const express = require("express");
const router = express.Router();
const Pelanggan = require("../models/Pelanggan");

// =============================
// REGISTER PELANGGAN
// POST /api/pelanggan/register
// =============================
router.post("/register", async (req, res) => {
  try {
    const { nama, email, no_telepon, username, password } = req.body;

    if (!nama || !email || !no_telepon || !username || !password) {
      return res.status(400).json({
        message: "Semua field wajib diisi",
      });
    }

    const existing = await Pelanggan.findOne({
      $or: [{ email }, { username }, { no_telepon }],
    });

    if (existing) {
      return res.status(409).json({
        message: "Email / Username / No Telepon sudah digunakan",
      });
    }

    const pelanggan = await Pelanggan.create({
      nama,
      email,
      no_telepon,
      username,
      password, // (belum hash, sesuai kondisi sekarang)
    });

    res.status(201).json({
      message: "Pelanggan berhasil register",
      data: pelanggan,
    });
  } catch (err) {
    res.status(500).json({
      message: "Gagal register pelanggan",
      error: err.message,
    });
  }
});

// =============================
// LOGIN PELANGGAN (SIMPLE)
// POST /api/pelanggan/login
// =============================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const pelanggan = await Pelanggan.findOne({ username, password });

    if (!pelanggan) {
      return res.status(401).json({
        message: "Username atau password salah",
      });
    }

    res.json({
      message: "Login berhasil",
      data: pelanggan,
    });
  } catch (err) {
    res.status(500).json({
      message: "Gagal login",
      error: err.message,
    });
  }
});

// =============================
// GET ALL PELANGGAN
// GET /api/pelanggan
// =============================
router.get("/", async (req, res) => {
  try {
    const data = await Pelanggan.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: "Gagal mengambil data pelanggan",
      error: err.message,
    });
  }
});

module.exports = router;
