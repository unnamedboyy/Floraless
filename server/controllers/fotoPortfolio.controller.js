import fotoPortfolio from "../models/fotoPortfolio.js";
import Portfolio from "../models/portfolio.js";
import { logActivity } from "../utils/logger.js";

export const addImage = async (req, res, next) => {
  try {
    const { portfolioId, url, caption } = req.body;

    const portfolio = await Portfolio.findById(portfolioId);
    if (!portfolio) throw { status: 404, message: "Portfolio tidak ditemukan" };

    const last = await fotoPortfolio.find({ portfolioId })
      .sort({ order: -1 })
      .limit(1);

    const order = last.length ? last[0].order + 1 : 1;

    const image = await fotoPortfolio.create({
      portfolioId,
      url,
      caption,
      order
    });

    await logActivity({
      userId: req.user.id,
      action: "ADD_IMAGE",
      customDescription: `Menambahkan gambar ke portfolio ${portfolio.title}`
    });

    res.json(image);

  } catch (err) {
    next(err);
  }
};

export const getImages = async (req, res, next) => {
  try {
    const data = await PortfolioImage.find({
      portfolioId: req.params.portfolioId
    }).sort({ order: 1 });

    res.json(data);

  } catch (err) {
    next(err);
  }
};

export const reorderImages = async (req, res, next) => {
  try {
    const { images } = req.body;

    // images = [{ id, order }]
    for (const item of images) {
      await PortfolioImage.findByIdAndUpdate(item.id, {
        order: item.order
      });
    }

    res.json({ message: "Reorder berhasil" });

  } catch (err) {
    next(err);
  }
};

export const deleteImage = async (req, res, next) => {
  try {
    const image = await PortfolioImage.findById(req.params.id);

    if (!image) throw { status: 404, message: "Image tidak ditemukan" };

    await image.deleteOne();

    res.json({ message: "Image dihapus" });

  } catch (err) {
    next(err);
  }
};