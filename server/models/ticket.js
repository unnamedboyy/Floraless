import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  pelangganId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pelanggan",
    required: true
  },
  layananId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Layanan",
    required: true
  },
  pegawaiId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pegawai",
    default: null
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "in_progress", "done"],
    default: "pending"
  }
}, { timestamps: true });

export default mongoose.model("Ticket", ticketSchema);