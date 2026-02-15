const express = require("express");
const router = express.Router();

const TicketPemesanan = require("../models/TicketPemesanan");
const Jadwal = require("../models/Jadwal");
const LogAktivitas = require("../models/LogAktivitas");
const { protect, authorize } = require("../middlewares/auth");

function getDayRange(date) {
  const d = new Date(date);
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
  return { start, end };
}

/**
 * =========================
 * CREATE TICKET
 * =========================
 */
router.post("/", protect, async (req, res) => {
  try {
    const { pelanggan, admin, layanan, info_acara, tanggal_acara } = req.body || {};

    if (!pelanggan || !layanan || !tanggal_acara) {
      return res.status(400).json({
        message: "pelanggan, layanan, tanggal_acara wajib",
      });
    }

    // CEK BENTROK
    const { start, end } = getDayRange(tanggal_acara);

    const conflict = await Jadwal.findOne({
      tanggal_acara: { $gte: start, $lt: end },
      status_tanggal: { $ne: "cancelled" },
    });

    if (conflict) {
      return res.status(409).json({
        message: "Tanggal sudah dibooking",
      });
    }

    const ticket = await TicketPemesanan.create({
      pelanggan,
      admin,
      layanan,
      info_acara,
      status: "pending",
    });

    await Jadwal.create({
      ticket: ticket._id,
      tanggal_acara,
      status_tanggal: "booked",
    });

    await LogAktivitas.create({
      ticket: ticket._id,
      actor: {
        id: req.user.id,
        role: req.user.role,
      },
      action: "create",
      message: "Ticket created",
    });

    // 🔥 UNIVERSAL REALTIME
    req.app.get("io").to("calendar_room").emit("calendar_refresh", {
    action: "create"
  });

    res.status(201).json({ ticket });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * =========================
 * GET ALL TICKET
 * =========================
 */
router.get("/", async (req, res) => {
  try {
    const tickets = await TicketPemesanan.find()
      .populate("pelanggan")
      .populate("admin")
      .populate("layanan")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * =========================
 * GET BY ID
 * =========================
 */
router.get("/:id", async (req, res) => {
  try {
    const ticket = await TicketPemesanan.findById(req.params.id)
      .populate("pelanggan")
      .populate("admin")
      .populate("layanan");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket tidak ditemukan" });
    }

    const jadwal = await Jadwal.find({ ticket: ticket._id })
      .sort({ tanggal_acara: 1 });

    res.json({ ticket, jadwal });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * =========================
 * UPDATE (ADMIN ONLY)
 * =========================
 */
router.patch("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const ticket = await TicketPemesanan.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket tidak ditemukan" });
    }

    const allowedFields = ["status", "admin", "info_acara", "layanan"];
    const changes = [];

    allowedFields.forEach(field => {
      if (
        req.body[field] !== undefined &&
        ticket[field]?.toString() !== req.body[field]?.toString()
      ) {
        changes.push({
          field,
          before: ticket[field],
          after: req.body[field],
        });

        ticket[field] = req.body[field];
      }
    });

    await ticket.save();

    if (changes.length > 0) {
      await LogAktivitas.create({
        ticket: ticket._id,
        actor: {
          id: req.user.id,
          role: req.user.role,
        },
        action: "update",
        changes,
        message: "Ticket updated",
      });
    }

    // 🔥 UNIVERSAL REALTIME
    req.app.get("io").to("calendar_room").emit("calendar_refresh", {
      action: "update"
    });

    res.json({ message: "Ticket berhasil diupdate", ticket });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * =========================
 * CANCEL TICKET
 * =========================
 */
router.patch("/:id/cancel", protect, async (req, res) => {
  try {
    const ticket = await TicketPemesanan.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket tidak ditemukan" });
    }

    ticket.status = "rejected";
    await ticket.save();

    await Jadwal.updateMany(
      { ticket: ticket._id },
      { status_tanggal: "cancelled" }
    );

    await LogAktivitas.create({
      ticket: ticket._id,
      actor: {
        id: req.user.id,
        role: req.user.role,
      },
      action: "cancel",
      message: "Ticket cancelled",
    });

    // 🔥 UNIVERSAL REALTIME
    req.app.get("io").to("calendar_room").emit("calendar_refresh", {
      action: "cancel"
    });

    res.json({ message: "Ticket berhasil dibatalkan", ticket });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * =========================
 * DELETE TICKET
 * =========================
 */
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const ticket = await TicketPemesanan.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket tidak ditemukan" });
    }

    await Jadwal.deleteMany({ ticket: ticket._id });
    await LogAktivitas.deleteMany({ ticket: ticket._id });

    // 🔥 UNIVERSAL REALTIME
    req.app.get("io").to("calendar_room").emit("calendar_refresh", {
      action: "cdelete"
    });

    res.json({ message: "Ticket dan relasi berhasil dihapus" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
