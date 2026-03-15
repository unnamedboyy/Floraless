const mongoose = require("mongoose");

const pembayaranSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TicketPemesanan",
      required: true,
      index: true,
    },

    pelanggan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pelanggan",
      required: true,
    },

    jenis_pembayaran: {
      type: String,
      enum: ["dp1", "dp2", "pelunasan"],
      required: true,
      index: true,
    },

    jumlah: {
      type: Number,
      required: true,
    },

    metode_pembayaran: {
      type: String,
      enum: ["transfer", "qris", "cash"],
      default: "transfer",
    },

    bukti_pembayaran: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
      index: true,
    },

    tanggal_pembayaran: {
      type: Date,
      default: Date.now,
    },

    verified_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    verified_at: {
      type: Date,
    },
  },
  { timestamps: true }
);

pembayaranSchema.index({ ticket: 1, jenis_pembayaran: 1 });

module.exports = mongoose.model("Pembayaran", pembayaranSchema);