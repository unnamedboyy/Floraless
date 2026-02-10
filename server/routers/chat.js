const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const RoomChat = require("../models/RoomChat");
const Admin = require("../models/Admin");
const Pelanggan = require("../models/Pelanggan");

/**
 * =========================
 * CREATE CHAT
 * POST /api/chat
 * =========================
 */
router.post("/", async (req, res) => {
  try {
    const {
      room,
      sender_role, // "admin" | "pelanggan"
      admin,
      pelanggan,
      isi_chat,
    } = req.body || {};

    if (!room || !sender_role || !isi_chat) {
      return res.status(400).json({
        message: "room, sender_role, isi_chat wajib",
      });
    }

    const roomExist = await RoomChat.findById(room);
    if (!roomExist) {
      return res.status(404).json({ message: "Room chat tidak ditemukan" });
    }

    if (sender_role === "admin") {
      if (!admin) {
        return res.status(400).json({ message: "admin wajib" });
      }
      const adminExist = await Admin.findById(admin);
      if (!adminExist) {
        return res.status(404).json({ message: "Admin tidak ditemukan" });
      }
    }

    if (sender_role === "pelanggan") {
      if (!pelanggan) {
        return res.status(400).json({ message: "pelanggan wajib" });
      }
      const pelangganExist = await Pelanggan.findById(pelanggan);
      if (!pelangganExist) {
        return res.status(404).json({ message: "Pelanggan tidak ditemukan" });
      }
    }

    const chat = await Chat.create({
      room,
      sender_role,
      admin: sender_role === "admin" ? admin : undefined,
      pelanggan: sender_role === "pelanggan" ? pelanggan : undefined,
      isi_chat,
    });

    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * =========================
 * GET CHAT BY ROOM
 * GET /api/chat/:roomId
 * =========================
 */
router.get("/:roomId", async (req, res) => {
  try {
    const chats = await Chat.find({ room: req.params.roomId })
      .populate("admin")
      .populate("pelanggan")
      .sort({ createdAt: 1 });

    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
