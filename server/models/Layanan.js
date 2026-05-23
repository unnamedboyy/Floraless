import mongoose from "mongoose";

const layananSchema = new mongoose.Schema({
  nama: String,
  deskripsi: String,
  harga: Number,
  thumbnail: {
      type: String,
      default: "",
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

layananSchema.index({ status: 1 });
layananSchema.index({ nama: "text" });

export default mongoose.model("Layanan", layananSchema);