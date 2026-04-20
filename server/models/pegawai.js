import mongoose from "mongoose";

const pegawaiSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  nama: String,
  no_telp: String,
  isActive: {
    type: Boolean,
    default: true
  }
});

pegawaiSchema.index({ userId: 1 });

export default mongoose.model("Pegawai", pegawaiSchema);