const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const Admin = require("../models/Admin");
const Pelanggan = require("../models/Pelanggan");
const { signToken, verifyToken } = require("../utils/jwt");

router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const payload = verifyToken(token);

    let user;

    if (payload.role === "admin") {
      user = await Admin.findById(payload.id).select("-password");
    } else {
      user = await Pelanggan.findById(payload.id).select("-password");
    }

    if (!user) {
      return res.status(401).json({ message: "User tidak ditemukan" });
    }

    res.json({
      id: user._id,
      username: user.username,
      role: payload.role,
    });

  } catch (err) {
    res.status(401).json({ message: "Token invalid" });
  }
});

/**
 * LOGIN (admin atau pelanggan)
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ message: "username & password wajib" });
    }

    let user = await Admin.findOne({ username });
    let role = "admin";

    if (!user) {
      user = await Pelanggan.findOne({ username });
      role = "user";
    }

    if (!user) {
      return res.status(401).json({ message: "User tidak ditemukan" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Password salah" });
    }

    const token = signToken({
      id: user._id,
      role,
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    res.json({
      message: "Login berhasil",
      user: {
        _id: user._id,
        username: user.username,
        role,
      },
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * LOGOUT
 */
router.post("/logout", (req, res) => {
  console.log("LOGOUT COOKIE BEFORE:", req.cookies);
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  console.log("LOGOUT CLEAR CALLED");
  res.json({ message: "Logout berhasil" });
});


module.exports = router;
