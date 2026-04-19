import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  tipe: {
    type: String,
    enum: ["DP1", "DP2", "FULL"]
  },
  nominal: Number,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  tanggal: Date
});

paymentSchema.index({ orderId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ tipe: 1 });

export default mongoose.model("Payment", paymentSchema);