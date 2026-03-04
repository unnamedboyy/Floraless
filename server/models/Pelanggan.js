const mongoose = require("mongoose");

const pelangganSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    email: { type: String, unique: true, sparse: true, },
    no_telepon: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pelanggan", pelangganSchema);
