import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
  judul: String,
  deskripsi: String
});

portfolioSchema.index({ judul: "text" });
fotoPortfolioSchema.index({ portfolioId: 1 });

export default mongoose.model("Portfolio", portfolioSchema);