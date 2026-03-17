const express = require("express");
const router = express.Router();

const Testimoni = require("../models/Testimoni");
const TicketPemesanan = require("../models/TicketPemesanan");

const { protect } = require("../middlewares/auth");

/* =================================================
   CREATE TESTIMONI
   POST /api/testimoni
================================================= */

router.post("/", protect, async (req, res) => {
  try {
    const { ticket, rating, komentar } = req.body;

    /* =========================
       VALIDASI INPUT
    ========================= */

    if (!ticket || !rating) {
      return res.status(400).json({
        message: "ticket dan rating wajib diisi",
      });
    }

    /* =========================
       CEK TICKET
    ========================= */

    const ticketData = await TicketPemesanan
      .findById(ticket)
      .populate("layanan");

    if (!ticketData) {
      return res.status(404).json({
        message: "Ticket tidak ditemukan",
      });
    }

    /* =========================
       VALIDASI PEMILIK
    ========================= */

    if (ticketData.pelanggan.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Anda tidak berhak memberi testimoni pada ticket ini",
      });
    }

    /* =========================
       VALIDASI STATUS
    ========================= */

    if (ticketData.status !== "fully_paid") {
      return res.status(400).json({
        message: "Testimoni hanya bisa dibuat setelah pembayaran lunas",
      });
    }

    /* =========================
       VALIDASI LAYANAN
    ========================= */

    if (!ticketData.layanan) {
      return res.status(400).json({
        message: "Ticket tidak memiliki layanan",
      });
    }

    /* =========================
       CEK DUPLIKAT TESTIMONI
    ========================= */

    const existing = await Testimoni.findOne({ ticket });

    if (existing) {
      return res.status(400).json({
        message: "Testimoni untuk ticket ini sudah dibuat",
      });
    }

    /* =========================
       CREATE TESTIMONI
    ========================= */

    const testimoni = await Testimoni.create({
      ticket,
      pelanggan: req.user.id,
      layanan: ticketData.layanan, // tidak pakai _id
      rating,
      komentar,
    });

    /* =========================
       UPDATE STATUS TICKET
    ========================= */

    ticketData.status = "selesai";
    await ticketData.save();

    res.status(201).json({
      message: "Testimoni berhasil dikirim",
      testimoni,
    });

  } catch (err) {
    console.error("CREATE TESTIMONI ERROR:", err);
    res.status(500).json({
      message: err.message || "Terjadi kesalahan server",
    });
  }
});


/* =================================================
   GET TESTIMONI BY TICKET
   GET /api/testimoni/ticket/:ticketId
================================================= */

router.get("/ticket/:ticketId", protect, async (req, res) => {
  try {

    const testimoni = await Testimoni.findOne({
      ticket: req.params.ticketId,
    })
      .populate("pelanggan", "username")
      .populate("layanan", "nama_layanan");

    res.json(testimoni);

  } catch (err) {
    console.error("GET TESTIMONI TICKET ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});


/* =================================================
   GET PUBLIC TESTIMONI
   GET /api/testimoni
================================================= */

router.get("/", async (req, res) => {
  try {

    const data = await Testimoni.find({ isVisible: true })
      .populate("pelanggan", "username")
      .populate("layanan", "nama_layanan")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/admin", protect, async (req, res) => {
  try {
    const data = await Testimoni.find()
      .populate("pelanggan", "username")
      .populate("layanan", "nama_layanan")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch(
  "/:id/visibility",
  protect,
  async (req, res) => {
    try {
      const testimoni = await Testimoni.findById(req.params.id);

      if (!testimoni) {
        return res.status(404).json({ message: "Testimoni tidak ditemukan" });
      }

      testimoni.isVisible = !testimoni.isVisible;
      await testimoni.save();

      res.json({
        message: "Visibility updated",
        testimoni,
      });

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);
module.exports = router;