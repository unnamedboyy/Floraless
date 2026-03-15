const express = require("express");
const router = express.Router();

const Pembayaran = require("../models/Pembayaran");
const TicketPemesanan = require("../models/TicketPemesanan");
const { protect, authorize } = require("../middlewares/auth");
const upload = require("../utils/upload");


// ============================
// CREATE PEMBAYARAN
// POST /api/pembayaran
// ============================
router.post(
  "/",
  protect,
  upload.single("bukti_pembayaran"), // <-- penting untuk FormData
  async (req, res) => {
    try {

      const {
        ticket,
        jenis_pembayaran,
        jumlah,
        metode_pembayaran,
      } = req.body || {};

      const bukti_pembayaran = req.file
        ? `/uploads/${req.file.filename}`
        : "";

      if (!ticket || !jenis_pembayaran || !jumlah) {
        return res.status(400).json({
          message: "ticket, jenis_pembayaran, jumlah wajib",
        });
      }

      const ticketExist = await TicketPemesanan.findById(ticket);

      if (!ticketExist) {
        return res.status(404).json({
          message: "Ticket tidak ditemukan",
        });
      }

      /* ============================
         CEGAH PEMBAYARAN GANDA
      ============================ */

      const existingPayment = await Pembayaran.findOne({
        ticket,
        jenis_pembayaran,
        status: { $in: ["pending", "verified"] },
      });

      if (existingPayment) {
        return res.status(400).json({
          message: `${jenis_pembayaran.toUpperCase()} sudah pernah dibuat`,
        });
      }

      /* ============================
         VALIDASI URUTAN PEMBAYARAN
      ============================ */

      const pembayaranSebelumnya = await Pembayaran.find({
        ticket,
        status: "verified",
      });

      const hasDP1 = pembayaranSebelumnya.find(
        (p) => p.jenis_pembayaran === "dp1"
      );

      const hasDP2 = pembayaranSebelumnya.find(
        (p) => p.jenis_pembayaran === "dp2"
      );

      if (jenis_pembayaran === "dp2" && !hasDP1) {
        return res.status(400).json({
          message: "DP1 harus dibayar terlebih dahulu",
        });
      }

      if (jenis_pembayaran === "pelunasan" && !hasDP2) {
        return res.status(400).json({
          message: "DP2 harus dibayar terlebih dahulu",
        });
      }

      /* ============================
         CREATE PEMBAYARAN
      ============================ */

      const pembayaran = await Pembayaran.create({
        ticket,
        pelanggan: req.user.id,
        jenis_pembayaran,
        jumlah,
        metode_pembayaran,
        bukti_pembayaran,
        status: "pending",
      });

      res.status(201).json(pembayaran);

    } catch (err) {
      console.error("CREATE PEMBAYARAN ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  }
);


// ============================
// GET PEMBAYARAN BY TICKET
// GET /api/pembayaran/ticket/:ticketId
// ============================
router.get("/ticket/:ticketId", protect, async (req, res) => {
  try {

    const pembayaran = await Pembayaran.find({
      ticket: req.params.ticketId,
    })
      .populate("pelanggan", "username")
      .populate("verified_by", "username")
      .sort({ createdAt: 1 });

    res.json(pembayaran);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ============================
// VERIFY PEMBAYARAN
// PATCH /api/pembayaran/:id/verify
// ============================
router.patch("/:id/verify", protect, authorize("admin"), async (req, res) => {
  try {

    const pembayaran = await Pembayaran.findById(req.params.id);

    if (!pembayaran) {
      return res.status(404).json({
        message: "Pembayaran tidak ditemukan",
      });
    }

    pembayaran.status = "verified";
    pembayaran.verified_by = req.user.id;
    pembayaran.verified_at = new Date();

    await pembayaran.save();

    /* ============================
       UPDATE STATUS TICKET
    ============================ */

    const ticket = await TicketPemesanan.findById(pembayaran.ticket);

    if (pembayaran.jenis_pembayaran === "dp1") {
      ticket.status = "dp1_verified";
    }

    if (pembayaran.jenis_pembayaran === "dp2") {
      ticket.status = "dp2_verified";
    }

    if (pembayaran.jenis_pembayaran === "pelunasan") {
      ticket.status = "fully_paid";
    }

    await ticket.save();

    res.json({
      message: "Pembayaran berhasil diverifikasi",
      pembayaran,
    });

  } catch (err) {
    console.error("VERIFY PEMBAYARAN ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});


// ============================
// REJECT PEMBAYARAN
// PATCH /api/pembayaran/:id/reject
// ============================
router.patch("/:id/reject", protect, authorize("admin"), async (req, res) => {
  try {

    const pembayaran = await Pembayaran.findById(req.params.id);

    if (!pembayaran) {
      return res.status(404).json({
        message: "Pembayaran tidak ditemukan",
      });
    }

    pembayaran.status = "rejected";

    await pembayaran.save();

    res.json({
      message: "Pembayaran ditolak",
      pembayaran,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ============================
// PAYMENT SUMMARY
// GET /api/pembayaran/summary/:ticketId
// ============================
router.get("/summary/:ticketId", protect, async (req, res) => {
  try {

    const ticketId = req.params.ticketId;

    const ticket = await TicketPemesanan.findById(ticketId)
      .populate("layanan");

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket tidak ditemukan",
      });
    }

    const pembayaran = await Pembayaran.find({
      ticket: ticketId,
      status: "verified",
    });

    const total_dibayar = pembayaran.reduce(
      (sum, p) => sum + p.jumlah,
      0
    );

    const total_harga = ticket.layanan?.harga || 0;

    const sisa = total_harga - total_dibayar;

    res.json({
      ticket_id: ticketId,
      total_harga,
      total_dibayar,
      sisa,
      pembayaran,
    });

  } catch (err) {
    console.error("PAYMENT SUMMARY ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});


// ============================
// GET ALL PEMBAYARAN
// GET /api/pembayaran
// ============================
router.get("/", protect, authorize("admin"), async (req, res) => {
  try {

    const pembayaran = await Pembayaran.find()
      .populate({
        path: "ticket",
        populate: [
          { path: "pelanggan", select: "username" },
          { path: "layanan", select: "nama_layanan harga" },
        ],
      })
      .populate("pelanggan", "username")
      .populate("verified_by", "username")
      .sort({ createdAt: -1 });

    res.json(pembayaran);

  } catch (err) {
    console.error("GET PEMBAYARAN ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;