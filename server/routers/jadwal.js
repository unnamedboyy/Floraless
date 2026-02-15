const express = require("express");
const router = express.Router();
const Jadwal = require("../models/Jadwal");
const LogAktivitas = require("../models/LogAktivitas");

function getDayRange(date) {
  const d = new Date(date);
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
  return { start, end };
}


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
 * CALENDAR SNAPSHOT
 * GET /api/jadwal/calendar?month=YYYY-MM
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

    const start = new Date(`${month}-01`);
    if (Number.isNaN(start.getTime())) {
      return res.status(400).json({
        message: "Format month tidak valid",
      });
    }

    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const jadwalList = await Jadwal.find({
      tanggal_acara: { $gte: start, $lt: end },
      status_tanggal: { $ne: "cancelled" },
    });

    const result = {};

    jadwalList.forEach((j) => {
      const dateKey = j.tanggal_acara.toISOString().split("T")[0];
      result[dateKey] = "booked";
    });

    res.json(result);
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

    if (req.body.tanggal_acara) {
      const { start, end } = getDayRange(req.body.tanggal_acara);

      const conflict = await Jadwal.findOne({
        _id: { $ne: req.params.id }, // kecuali dirinya sendiri
        tanggal_acara: { $gte: start, $lt: end },
        status_tanggal: { $ne: "cancelled" },
      });

      if (conflict) {
        return res.status(409).json({
          message: "Tanggal sudah dibooking",
        });
      }

      jadwal.tanggal_acara = req.body.tanggal_acara;
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
