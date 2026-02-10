const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");

/**
 * =========================
 * POST /api/admin/register
 * =========================
 * PUBLIC — tidak pakai auth
 */
router.post("/register", async (req, res) => {
  try {
    const { nama, email, no_telepon, username, password, role } = req.body || {};

    if (!nama || !email || !username || !password) {
      return res.status(400).json({
        message: "nama, email, username, password wajib",
      });
    }

    const exists = await Admin.findOne({ username });
    if (exists) {
      return res.status(409).json({ message: "Username sudah digunakan" });
    }

    const admin = await Admin.create({
      nama,
      email,
      no_telepon,
      username,
      password, // 🔥 plaintext OK → akan di-hash oleh schema
      role: role || "admin",
    });

    res.status(201).json({
      message: "Admin berhasil dibuat",
      admin: {
        id: admin._id,
        nama: admin.nama,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error("❌ admin register:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
