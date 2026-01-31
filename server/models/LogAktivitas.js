const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    ticket: { type: mongoose.Schema.Types.ObjectId, ref: "TicketPemesanan", required: true, index: true },
    info: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LogAktivitas", logSchema);
