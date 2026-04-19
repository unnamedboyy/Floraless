import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  aktivitas: String,
  waktu: { type: Date, default: Date.now }
});

logSchema.index({ userId: 1 });
logSchema.index({ waktu: -1 });

export default mongoose.model("LogAktivitas", logSchema);