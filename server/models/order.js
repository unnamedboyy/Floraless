import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  pelangganId: { type: mongoose.Schema.Types.ObjectId, ref: "Pelanggan" },
  layananId: { type: mongoose.Schema.Types.ObjectId, ref: "Layanan" },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "selesai"],
    default: "pending"
  }
}, { timestamps: true });

orderSchema.index({ pelangganId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ layananId: 1 });

export default mongoose.model("Order", orderSchema);
