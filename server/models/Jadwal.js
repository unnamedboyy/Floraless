const mongoose = require("mongoose");

const jadwalSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TicketPemesanan",
      required: true,
      index: true,
    },

    tanggal_acara: {
      type: Date,
      required: true,
      index: true,
    },

    tanggal_key: {
      type: String,
      required: true,
      index: true,
    },

    status_tanggal: {
      type: String,
      default: "booked",
      index: true,
    },

    info: {
      type: String,
    },
  },
  { timestamps: true }
);

jadwalSchema.index({ tanggal_key: 1, status_tanggal: 1 });

module.exports = mongoose.model("Jadwal", jadwalSchema);
