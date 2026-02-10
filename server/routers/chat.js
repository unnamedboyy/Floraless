const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");

const Chat = require("../models/Chat");
const RoomChat = require("../models/RoomChat");
const { createChat } = require("../services/chat");

/**
 * =========================
 * POST /api/chat
 * Create chat (pelanggan / admin)
 * =========================
 */
router.post("/", auth, async (req, res) => {
  try {
    const { isi_chat, roomId } = req.body;
    const user = req.user;

    const result = await createChat({
      roomId,
      isi_chat,
      sender_role: user.role,
      adminId: user.role === "admin" ? user.id : undefined,
      pelangganId: user.role === "pelanggan" ? user.id : undefined,
    });

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * =========================
 * GET /api/chat/room/:roomId
 * =========================
 */
router.get("/room/:roomId", async (req, res) => {
  try {
    const chats = await Chat.find({ room: req.params.roomId })
      .sort({ createdAt: 1 })
      .populate("admin")
      .populate("pelanggan");

    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * =========================
 * GET /api/chat/pelanggan/:pelangganId
 * =========================
 */
router.get("/pelanggan/:pelangganId", async (req, res) => {
  try {
    const room = await RoomChat.findOne({
      pelanggan: req.params.pelangganId,
    });

    if (!room) {
      return res.json({ room: null, chats: [] });
    }

    const chats = await Chat.find({ room: room._id })
      .sort({ createdAt: 1 })
      .populate("admin")
      .populate("pelanggan");

    res.json({ room, chats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
