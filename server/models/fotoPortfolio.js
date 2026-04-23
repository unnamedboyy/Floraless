import mongoose from "mongoose";

const fotoPortfolioSchema = new mongoose.Schema({
  portfolioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Portfolio",
    required: true
  },

  url: {
    type: String,
    required: true
  },

  order: {
    type: Number,
    default: 0
  },

  caption: String

}, { timestamps: true });

export default mongoose.model("FotoPortfolio", fotoPortfolioSchema);