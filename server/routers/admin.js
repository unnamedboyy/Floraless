const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");

/**
 * =========================
 * CREATE ADMIN
 * POST /api/admin
 * =========================
 */
router.post("/", async (req, res) => {
  try {
    const { nama, email, no_telepon, username, password, role } = req.body || {};

    if (!nama || !email || !no_telepon || !username || !password) {
      return res.status(400).json({
        message: "nama, email, no_telepon, username, password wajib",
      });
    }

    const exists = await Admin.findOne({
      $or: [{ email }, { username }, { no_telepon }],
    });

    if (exists) {
      return res.status(409).json({
        message: "Email / Username / No telepon sudah terdaftar",
      });
    }

    const admin = await Admin.create({
      nama,
      email,
      no_telepon,
      username,
      password,
      role: role || "admin",
    });

    res.status(201).json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * =========================
 * GET ALL ADMIN
 * GET /api/admin
 * =========================
 */
router.get("/", async (req, res) => {
  try {
    const admins = await Admin.find().sort({ createdAt: -1 });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * =========================
 * GET ADMIN BY ID
 * GET /api/admin/:id
 * =========================
 */
router.get("/:id", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin tidak ditemukan" });
    }
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * =========================
 * UPDATE ADMIN
 * PATCH /api/admin/:id
 * =========================
 */
router.patch("/:id", async (req, res) => {
  try {
    const updated = await Admin.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Admin tidak ditemukan" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * =========================
 * DELETE ADMIN
 * DELETE /api/admin/:id
 * =========================
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Admin.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Admin tidak ditemukan" });
    }

    res.json({ message: "Admin berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
