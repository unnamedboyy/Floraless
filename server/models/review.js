import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
    required: true,
    unique: true // 1 ticket = 1 review
  },
  pelangganId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pelanggan",
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  komentar: String
}, { timestamps: true });

reviewSchema.index({ ticketId: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);