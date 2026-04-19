import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema({
  kode: { type: String, unique: true },
  nominal: Number,
  expired_at: Date,
  is_used: { type: Boolean, default: false }
});

voucherSchema.index({ kode: 1 }, { unique: true });
voucherSchema.index({ expired_at: 1 });

export default mongoose.model("Voucher", voucherSchema);