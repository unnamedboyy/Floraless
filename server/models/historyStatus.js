import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  status: String,
  waktu: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  catatan: String
});

historySchema.index({ orderId: 1 });
historySchema.index({ waktu: -1 });

export default mongoose.model("HistoryStatus", historySchema);