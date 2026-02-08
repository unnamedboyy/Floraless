const express = require("express");
const router = express.Router();
const TicketPemesanan = require("../models/TicketPemesanan");

router.post("/", async (req, res) => {
  try {
    console.log("BODY MASUK 👉", req.body); // 🔍 DEBUG

    const { pelangganId, layananId, tanggal, info } = req.body;

    if (!pelangganId || !layananId || !tanggal) {
      return res.status(400).json({
        message: "pelangganId, layananId, tanggal wajib diisi"
      });
    }

    const ticket = await TicketPemesanan.create({
      pelanggan: pelangganId,
      layanan: layananId,
      status: "pending",
      info_acara: info || "",
      jadwal: [
        {
          tanggal_acara: new Date(tanggal),
          status_tanggal: "booked"
        }
      ]
    });

    res.status(201).json({
      message: "Booking berhasil",
      data: ticket
    });

  } catch (err) {
    console.error("❌ booking error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
