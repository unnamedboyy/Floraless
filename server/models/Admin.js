import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  nama: String
});

adminSchema.index({ userId: 1 });

export default mongoose.model("Admin", adminSchema);