const mongoose = require("mongoose");

const jadwalSchema = new mongoose.Schema(
  {
    tanggal_acara: {
      type: Date,
      required: true,
    },

    status_tanggal: {
      type: String,
      default: "booked",
    },

    info: {
      type: String,
    },
  },
  { _id: false }
);

const ticketSchema = new mongoose.Schema(
  {
    pelanggan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pelanggan",
      required: true,
      index: true,
    },

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    layanan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Layanan",
      required: true,
    },

    status: {
      type: String,
      default: "pending",
      index: true,
    },

    info_acara: {
      type: String,
    },

    jadwal: {
      type: [jadwalSchema],
      default: [],
    },
  },
  { timestamps: true }
);

ticketSchema.index({ "jadwal.tanggal_acara": 1, status: 1 });

module.exports = mongoose.model("TicketPemesanan", ticketSchema);