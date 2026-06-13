import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({

  layananIds: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Layanan"
      }
    ],
    validate: {
      validator: function (val) {
        return val.length <= 1;
      },
      message: "Kategori layanan maksimal 1"
    }
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
    required: true
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