import mongoose from "mongoose";

const layananSchema = new mongoose.Schema({
  nama: String,
  deskripsi: String,
  harga: Number,
});

layananSchema.index({ status: 1 });
layananSchema.index({ nama: "text" });

export default mongoose.model("Layanan", layananSchema);