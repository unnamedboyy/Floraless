import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({

  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket"
  },

  title: String,
  content: String,
  rating: Number,
  review: String,

  type: {
    type: String,
    enum: ["auto", "manual"],
    default: "manual"
  },

  isActive: {
    type: Boolean,
    default: true
  },

  thumbnail: String,
  slug: {
    type: String,
    unique: true
  },
  excerpt: String,

}, { timestamps: true });

portfolioSchema.index(
  { ticketId: 1 },
  { unique: true, partialFilterExpression: { ticketId: { $exists: true } } }
);

export default mongoose.model("Portfolio", portfolioSchema);