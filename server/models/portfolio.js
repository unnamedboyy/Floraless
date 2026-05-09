import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({

  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket"
  },

  layananIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Layanan"
    }
  ],

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
  
  content: {
    type: String,
    default: ""
  },

  rating: Number,
  review: String,

  isFeatured: {
    type: Boolean,
    default: false
  },

  type: {
    type: String,
    enum: ["ticket", "manual"],
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
portfolioSchema.index({ layananIds: 1 });
portfolioSchema.index({ isFeatured: 1 });

export default mongoose.model(
  "Portfolio",
  portfolioSchema
);
