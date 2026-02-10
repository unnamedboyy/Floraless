const express = require("express");
const router = express.Router();
const LogAktivitas = require("../models/LogAktivitas");

/**
 * =========================
 * GET LOG BY TICKET
 * GET /api/log/:ticketId
 * =========================
 */
router.get("/:ticketId", async (req, res) => {
  try {
    const logs = await LogAktivitas.find({
      ticket: req.params.ticketId,
    }).sort({ createdAt: 1 });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
