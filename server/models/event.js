import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  tanggal_acara: Date,
  lokasi: String,
  catatan: String
});

eventSchema.index({ tanggal_acara: 1 });
eventSchema.index({ orderId: 1 });

export default mongoose.model("Event", eventSchema);