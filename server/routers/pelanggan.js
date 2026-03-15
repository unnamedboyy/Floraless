const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Pelanggan = require("../models/Pelanggan");

// CREATE PELANGGAN
// POST /api/pelanggan
router.post("/", async (req, res) => {
  try {
    const { nama, email, no_telepon, username, password } = req.body || {};

    if (!nama || !email || !no_telepon || !username || !password) {
      return res.status(400).json({
        message: "nama, email, no_telepon, username, password wajib",
      });
    }

    const exists = await Pelanggan.findOne({
      $or: [{ email }, { username }, { no_telepon }],
    });

    if (exists) {
      return res.status(409).json({
        message: "Email / Username / No telepon sudah terdaftar",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const pelanggan = await Pelanggan.create({
      nama,
      email,
      no_telepon,
      username,
      password: hashedPassword,
    });

    res.status(201).json(pelanggan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL PELANGGAN
// GET /api/pelanggan
router.get("/", async (req, res) => {
  try {
    const tickets = await TicketPemesanan.find()
      .populate("pelanggan")
      .populate("admin")
      .populate("layanan")
      .sort({ createdAt: -1 });

    const clean = tickets.filter(t => t.pelanggan);

    res.json(clean);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET PELANGGAN BY ID
// GET /api/pelanggan/:id
router.get("/:id", async (req, res) => {
  try {
    const pelanggan = await Pelanggan.findById(req.params.id);
    if (!pelanggan) {
      return res.status(404).json({ message: "Pelanggan tidak ditemukan" });
    }
    res.json(pelanggan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE PELANGGAN
// PATCH /api/pelanggan/:id
router.patch("/:id", async (req, res) => {
  try {
    const updated = await Pelanggan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Pelanggan tidak ditemukan" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE PELANGGAN
// DELETE /api/pelanggan/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Pelanggan.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Pelanggan tidak ditemukan" });
    }

    res.json({ message: "Pelanggan berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;