const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: "RoomChat", required: true, index: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }, // kalau sender admin
    pelanggan: { type: mongoose.Schema.Types.ObjectId, ref: "Pelanggan" }, // kalau sender pelanggan
    isi_chat: { type: String, required: true },
    sender_role: { type: String, enum: ["admin", "pelanggan"], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
