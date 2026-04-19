import mongoose from "mongoose";

const fotoPortfolioSchema = new mongoose.Schema({
  portfolioId: { type: mongoose.Schema.Types.ObjectId, ref: "Portfolio" },
  path: String,
  is_default: Boolean
});

export default mongoose.model("FotoPortfolio", fotoPortfolioSchema);