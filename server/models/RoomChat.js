const mongoose = require("mongoose");

const roomChatSchema = new mongoose.Schema(
  {
    pelanggan: { type: mongoose.Schema.Types.ObjectId, ref: "Pelanggan", required: true, unique: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RoomChat", roomChatSchema);
