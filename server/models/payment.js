import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
    required: true
  },

  tipe: {
    type: String,
    enum: ["DP1", "DP2", "PELUNASAN"],
    required: true
  },

  jumlah: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ["paid"],
    default: "paid"
  }

}, { timestamps: true });

paymentSchema.index({ ticketId: 1 });

export default mongoose.model("Payment", paymentSchema);