import mongoose from "mongoose";

const pelangganSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  nama: String,
  no_telp: String
});

pelangganSchema.index({ userId: 1 });

export default mongoose.model("Pelanggan", pelangganSchema);