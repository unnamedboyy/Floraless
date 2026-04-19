import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  pegawaiId: { type: mongoose.Schema.Types.ObjectId, ref: "Pegawai" }
});

assignmentSchema.index({ pegawaiId: 1 });
assignmentSchema.index({ orderId: 1 });

export default mongoose.model("Assignment", assignmentSchema);