const express = require("express");
const router = express.Router();
const CalendarBlock = require("../models/CalendarBlock");

router.get("/", async (req, res) => {
  try {
    const blocks = await CalendarBlock.find();
    res.json(blocks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { date, reason } = req.body;

    const exists = await CalendarBlock.findOne({ date });
    if (exists) {
      return res.status(400).json({ message: "Tanggal sudah diblock" });
    }

    const block = await CalendarBlock.create({ date, reason });

    req.io.emit("calendar_blocked", block);

    res.status(201).json(block);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:date", async (req, res) => {
  try {
    const date = new Date(req.params.date);

    const deleted = await CalendarBlock.findOneAndDelete({ date });
    if (!deleted) {
      return res.status(404).json({ message: "Block tidak ditemukan" });
    }

    req.io.emit("calendar_unblocked", date);

    res.json({ message: "Tanggal berhasil dibuka" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
