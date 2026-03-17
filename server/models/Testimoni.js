const mongoose = require("mongoose");

const TestimoniSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TicketPemesanan",
      required: true,
    },

    pelanggan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pelanggan",
      required: true,
    },

    layanan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Layanan",
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    komentar: {
      type: String,
    },

    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimoni", TestimoniSchema);