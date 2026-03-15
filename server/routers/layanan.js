const express = require("express");
const router = express.Router();
const Layanan = require("../models/Layanan");
const upload = require("../utils/upload");
const { verifyToken } = require("../utils/jwt");

// MIDDLEWARE ADMIN ONLY
function adminOnly(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const payload = verifyToken(token);
    if (payload.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// GET ALL LAYANAN
// GET /api/layanan
router.get("/", async (req, res) => {
  try {
    const layanan = await Layanan.find().sort({ createdAt: -1 });
    res.json(layanan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET LAYANAN BY ID
// GET /api/layanan/:id
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

// CREATE LAYANAN
// POST /api/layanan
router.post("/", adminOnly, upload.single("gambar"), async (req, res) => {
  try {
    const { nama_layanan, deskripsi, harga } = req.body;

    if (!nama_layanan || harga == null) {
      return res.status(400).json({
        message: "nama_layanan dan harga wajib",
      });
    }

    const layanan = await Layanan.create({
      nama_layanan,
      deskripsi: deskripsi || "",
      harga,
      gambar: req.file ? `/uploads/${req.file.filename}` : "",
    });

    res.status(201).json(layanan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE LAYANAN
// PATCH /api/layanan/:id
router.patch("/:id", adminOnly, upload.single("gambar"), async (req, res) => {
  try {
    const updateData = {
      ...req.body,
    };

    if (req.file) {
      updateData.gambar = `/uploads/${req.file.filename}`;
    }

    const updated = await Layanan.findByIdAndUpdate(
      req.params.id,
      updateData,
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

// DELETE LAYANAN
// DELETE /api/layanan/:id
router.delete("/:id", adminOnly, async (req, res) => {
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