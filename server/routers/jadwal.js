const express = require("express");
const router = express.Router();
const Jadwal = require("../models/Jadwal");
const LogAktivitas = require("../models/LogAktivitas");

/**
 * =========================
 * GET ALL JADWAL
 * GET /api/jadwal
 * =========================
 */
router.get("/", async (req, res) => {
  try {
    const jadwal = await Jadwal.find()
      .populate("ticket")
      .sort({ tanggal_acara: 1 });

    res.json(jadwal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const jadwal = await Jadwal.find()
      .populate("ticket")
      .sort({ tanggal_acara: 1 });

    res.json(jadwal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * =========================
 * GET JADWAL BY ID
 * GET /api/jadwal/:id
 * =========================
 */
router.get("/:id", async (req, res) => {
  try {
    const jadwal = await Jadwal.findById(req.params.id)
      .populate({
        path: "ticket",
        populate: ["pelanggan", "admin", "layanan"],
      });

    if (!jadwal) {
      return res.status(404).json({ message: "Jadwal tidak ditemukan" });
    }

    res.json(jadwal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * =========================
 * UPDATE STATUS JADWAL
 * PATCH /api/jadwal/:id
 * =========================
 */
router.patch("/:id", async (req, res) => {
  try {
    const { status_tanggal, info } = req.body || {};

    const jadwal = await Jadwal.findById(req.params.id);
    if (!jadwal) {
      return res.status(404).json({ message: "Jadwal tidak ditemukan" });
    }

    if (status_tanggal) jadwal.status_tanggal = status_tanggal;
    if (info !== undefined) jadwal.info = info;

    await jadwal.save();

    await LogAktivitas.create({
      ticket: jadwal.ticket,
      info: `Status jadwal ${jadwal._id} diubah menjadi ${jadwal.status_tanggal}`,
    });

    res.json(jadwal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
