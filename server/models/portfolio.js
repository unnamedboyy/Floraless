import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({

  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket"
  },

  title: {
    type: String,
    required: true
  },

  slug: {
    type: String,
    unique: true,
    required: true
  },

  excerpt: {
    type: String,
    default: ""
  },

  thumbnail: {
    type: String,
    required: true
  },

  content: {
    type: String,
    default: ""
  },

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
  }

}, { timestamps: true });

portfolioSchema.index(
  { ticketId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      ticketId: { $exists: true }
    }
  }
);

portfolioSchema.index({ slug: 1 });

export default mongoose.model(
  "Portfolio",
  portfolioSchema
);