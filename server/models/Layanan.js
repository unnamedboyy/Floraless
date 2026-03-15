const mongoose = require("mongoose");

const layananSchema = new mongoose.Schema(
  {
    nama_layanan: {
      type: String,
      required: true,
    },

    deskripsi: {
      type: String,
    },

    harga: {
      type: Number,
      required: true,
    },

    gambar: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Layanan", layananSchema);