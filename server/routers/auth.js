const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const Admin = require("../models/Admin");
const Pelanggan = require("../models/Pelanggan");
const { signToken, verifyToken } = require("../utils/jwt");


// GET CURRENT USER
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
      role: payload.role
    });

  } catch (err) {
    res.status(401).json({ message: "Token invalid" });
  }
});



// LOGIN
router.post("/login", async (req, res) => {

  try {

    const { username, password } = req.body;

    let user = await Admin.findOne({ username });
    let role = "admin";

    if (!user) {
      user = await Pelanggan.findOne({ username });
      role = "pelanggan";
    }

    if (!user) {
      return res.status(401).json({
        message: "Username tidak ditemukan"
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        message: "Password salah"
      });
    }

    const token = signToken({
      id: user._id,
      role
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false
    });

    res.json({
      message: "Login berhasil",
      user: {
        _id: user._id,
        username: user.username,
        role
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }

});



// LOGOUT
router.post("/logout", (req, res) => {

  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false
  });

  res.json({ message: "Logout berhasil" });

});



// REGISTER
router.post("/register", async (req, res) => {

  try {

    const { nama, email, no_telepon, username, password } = req.body;

    const existing = await Pelanggan.findOne({
      $or: [
        { username },
        { no_telepon },
        ...(email ? [{ email }] : [])
      ]
    });

    if (existing) {

      if (existing.username === username) {
        return res.status(400).json({
          message: "Username sudah digunakan"
        });
      }

      if (existing.no_telepon === no_telepon) {
        return res.status(400).json({
          message: "Nomor telepon sudah terdaftar"
        });
      }

      if (existing.email === email) {
        return res.status(400).json({
          message: "Email sudah digunakan"
        });
      }

    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const pelanggan = await Pelanggan.create({
      nama,
      email,
      no_telepon,
      username,
      password: hashedPassword
    });

    const token = signToken({
      id: pelanggan._id,
      role: "pelanggan"
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false
    });

    res.status(201).json({
      message: "Register berhasil",
      user: {
        _id: pelanggan._id,
        username: pelanggan.username,
        role: "pelanggan"
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }

});


module.exports = router;