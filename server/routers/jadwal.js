const express = require("express");
const router = express.Router();
const Jadwal = require("../models/Jadwal");
const LogAktivitas = require("../models/LogAktivitas");
const { protect, authorize } = require("../middlewares/auth");

/**
 * =========================
 * CALENDAR SNAPSHOT
 * =========================
 */
router.get("/calendar", async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({
        message: "Query month wajib (format: YYYY-MM)",
      });
    }

    const jadwalList = await Jadwal.find({
      tanggal_key: { $regex: `^${month}` },
    });

    const result = {};

    jadwalList.forEach((j) => {
      result[j.tanggal_key] = j.status_tanggal;
    });

    res.json(result);
  } catch (err) {
    console.error("CALENDAR ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});


/**
 * =========================
 * GET JADWAL BY DATE
 * =========================
 */
router.get("/by-date", async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Query date wajib" });
    }

    const jadwal = await Jadwal.findOne({
      tanggal_key: date,
    }).populate({
      path: "ticket",
      populate: [
        { path: "pelanggan", select: "username" },
        { path: "layanan", select: "nama_layanan" },
      ],
    });

    if (!jadwal) {
      return res
        .status(404)
        .json({ message: "Tidak ada booking di tanggal ini" });
    }

    res.json({
      _id: jadwal._id,
      tanggal_key: jadwal.tanggal_key,
      status_tanggal: jadwal.status_tanggal,
      ticket: jadwal.ticket,
    });
  } catch (err) {
    console.error("BY-DATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * =========================
 * GET ALL JADWAL
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

/**
 * =========================
 * GET JADWAL BY ID
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
 * UPDATE JADWAL (ADMIN)
 * =========================
 */
router.patch("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const { status_tanggal, info, tanggal_acara } = req.body || {};

    const jadwal = await Jadwal.findById(req.params.id);
    if (!jadwal) {
      return res.status(404).json({ message: "Jadwal tidak ditemukan" });
    }

    if (tanggal_acara) {
      const conflict = await Jadwal.findOne({
        _id: { $ne: req.params.id },
        tanggal_key: tanggal_acara,
        status_tanggal: { $ne: "cancelled" },
      });

      if (conflict) {
        return res.status(409).json({
          message: "Tanggal sudah dibooking",
        });
      }

      jadwal.tanggal_acara = new Date(tanggal_acara);
      jadwal.tanggal_key = tanggal_acara;
    }

    if (status_tanggal) jadwal.status_tanggal = status_tanggal;
    if (info !== undefined) jadwal.info = info;

    await jadwal.save();

    await LogAktivitas.create({
      ticket: jadwal.ticket,
      actor: {
        id: req.user.id,
        role: req.user.role,
      },
      action: "update_jadwal",
      message: "Jadwal updated",
    });

    req.app.get("io").to("calendar_room").emit("calendar_refresh");

    res.json(jadwal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
