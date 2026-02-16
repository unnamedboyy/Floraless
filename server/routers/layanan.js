const express = require("express");
const router = express.Router();
const Layanan = require("../models/Layanan");

/**
 * =========================
 * CREATE LAYANAN
 * POST /api/layanan
 * =========================
 */
router.post("/", async (req, res) => {
  try {
    const { nama_layanan, deskripsi, harga } = req.body || {};

    if (!nama_layanan || harga == null) {
      return res.status(400).json({
        message: "nama_layanan dan harga wajib",
      });
    }

    const layanan = await Layanan.create({
      nama_layanan,
      deskripsi: deskripsi || "",
      harga,
    });

    res.status(201).json(layanan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * =========================
 * GET ALL LAYANAN
 * GET /api/layanan
 * =========================
 */
router.get("/", async (req, res) => {
  try {
    const layanan = await Layanan.find().sort({ createdAt: -1 });
    res.json(layanan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * =========================
 * GET LAYANAN BY ID
 * GET /api/layanan/:id
 * =========================
 */
router.get("/:id", async (req, res) => {
  try {
    const layanan = await Layanan.findById(req.params.id);
    if (!layanan) {
      return res.status(404).json({ message: "Layanan tidak ditemukan" });
    }
    res.json(layanan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const list = await Layanan.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/**
 * =========================
 * UPDATE LAYANAN
 * PATCH /api/layanan/:id
 * =========================
 */
router.patch("/:id", async (req, res) => {
  try {
    const updated = await Layanan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Layanan tidak ditemukan" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * =========================
 * DELETE LAYANAN
 * DELETE /api/layanan/:id
 * =========================
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Layanan.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Layanan tidak ditemukan" });
    }

    res.json({ message: "Layanan berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
