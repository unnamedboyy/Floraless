import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  isi_review: String
});

reviewSchema.index({ orderId: 1 });

export default mongoose.model("Review", reviewSchema);