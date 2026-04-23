import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  pelangganId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pelanggan",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  expiredAt: Date
}, { timestamps: true });

export default mongoose.model("Voucher", voucherSchema);