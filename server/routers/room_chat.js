const express = require("express");
const router = express.Router();
const RoomChat = require("../models/RoomChat");
const Pelanggan = require("../models/Pelanggan");

// CREATE / GET ROOM BY PELANGGAN
// POST /api/room-chat
router.post("/", async (req, res) => {
  try {
    const { pelanggan } = req.body || {};

    if (!pelanggan) {
      return res.status(400).json({ message: "pelanggan wajib" });
    }

    const pelangganExist = await Pelanggan.findById(pelanggan);
    if (!pelangganExist) {
      return res.status(404).json({ message: "Pelanggan tidak ditemukan" });
    }

    let room = await RoomChat.findOne({ pelanggan });

    if (!room) {
      room = await RoomChat.create({ pelanggan });
    }

    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL ROOM CHAT
// GET /api/room-chat
router.get("/", async (req, res) => {
  try {
    const rooms = await RoomChat.find()
      .populate("pelanggan")
      .sort({ createdAt: -1 });

    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ROOM CHAT BY ID
// GET /api/room-chat/:id
router.get("/:id", async (req, res) => {
  try {
    const room = await RoomChat.findById(req.params.id).populate("pelanggan");

    if (!room) {
      return res.status(404).json({ message: "Room tidak ditemukan" });
    }

    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;