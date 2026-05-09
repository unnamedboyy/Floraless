import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({

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

  isFeatured: {
    type: Boolean,
    default: false
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

portfolioSchema.index({ slug: 1 });
portfolioSchema.index({ layananIds: 1 });
portfolioSchema.index({ isFeatured: 1 });

export default mongoose.model(
  "Portfolio",
  portfolioSchema
);
