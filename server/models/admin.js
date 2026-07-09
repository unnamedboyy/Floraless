import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  nama: String,
  email: {type: String, default: ""},
  isActive: {type: Boolean, default: true},
});

adminSchema.index({ userId: 1 });

export default mongoose.model("Admin", adminSchema);