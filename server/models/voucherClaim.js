import mongoose from "mongoose";

const voucherClaimSchema = new mongoose.Schema({
  voucherId: { type: mongoose.Schema.Types.ObjectId, ref: "Voucher" },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  pelangganId: { type: mongoose.Schema.Types.ObjectId, ref: "Pelanggan" },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  bukti: String
});

voucherClaimSchema.index({ pelangganId: 1 });
voucherClaimSchema.index({ orderId: 1 });
voucherClaimSchema.index({ status: 1 });

export default mongoose.model("VoucherClaim", voucherClaimSchema);