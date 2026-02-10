const express = require("express");
const router = express.Router();

const TicketPemesanan = require("../models/TicketPemesanan");
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
 * CREATE TICKET + JADWAL
 * POST /api/ticket
 * =========================
 */
router.post("/", async (req, res) => {
  try {
    const {
      pelanggan,
      admin,
      layanan,
      info_acara,
      tanggal_acara, 
    } = req.body || {};

    if (!pelanggan || !layanan || !tanggal_acara) {
      return res.status(400).json({
        message: "pelanggan, layanan, tanggal_acara wajib",
      });
    }

    // 1 validasi wajib
    if (!pelanggan || !layanan || !tanggal_acara) {
      return res.status(400).json({
        message: "pelanggan, layanan, tanggal_acara wajib",
      });
    }

    // 2 CEK BENTROK TANGGAL (DI SINI)
    const { start, end } = getDayRange(tanggal_acara);

    const conflict = await Jadwal.findOne({
      tanggal_acara: { $gte: start, $lt: end },
      status_tanggal: { $ne: "cancelled" },
    });

    if (conflict) {
      return res.status(409).json({
        message: "Tanggal sudah dibooking",
        conflict_jadwal_id: conflict._id,
        ticket_id: conflict.ticket,
      });
    }

    // 3 create ticket
    const ticket = await TicketPemesanan.create({
      pelanggan,
      admin,
      layanan,
      info_acara,
      status: "pending",
    });

    // 4 create jadwal (collection terpisah)
    const jadwal = await Jadwal.create({
      ticket: ticket._id,
      tanggal_acara,
      status_tanggal: "booked",
    });

    // 5 log aktivitas
    await LogAktivitas.create({
      ticket: ticket._id,
      info: `Ticket dibuat dengan tanggal ${new Date(tanggal_acara).toISOString()}`,
    });

    res.status(201).json({
      ticket,
      jadwal,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * =========================
 * GET ALL TICKET
 * GET /api/ticket
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
 * GET TICKET BY ID
 * GET /api/ticket/:id
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

    const jadwal = await Jadwal.find({ ticket: ticket._id }).sort({
      tanggal_acara: 1,
    });

    res.json({ ticket, jadwal });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * =========================
 * UPDATE STATUS TICKET
 * PATCH /api/ticket/:id/status
 * =========================
 */
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body || {};

    const ticket = await TicketPemesanan.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket tidak ditemukan" });
    }

    ticket.status = status;
    await ticket.save();

    await LogAktivitas.create({
      ticket: ticket._id,
      info: `Status ticket diubah menjadi ${status}`,
    });

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * =========================
 * DELETE TICKET (HARD DELETE)
 * DELETE /api/ticket/:id
 * =========================
 */
router.delete("/:id", async (req, res) => {
  try {
    const ticket = await TicketPemesanan.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket tidak ditemukan" });
    }

    await Jadwal.deleteMany({ ticket: ticket._id });
    await LogAktivitas.deleteMany({ ticket: ticket._id });

    res.json({ message: "Ticket dan relasi berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
