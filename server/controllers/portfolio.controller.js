import Portfolio from "../models/portfolio.js";
import Ticket from "../models/ticket.js";
import Review from "../models/review.js";
import DetailTicket from "../models/detailTicket.js";
import { logActivity } from "../utils/logger.js";
import fotoPortfolio from "../models/fotoPortfolio.js";

export const createPortfolio = async (req, res, next) => {
  try {
    const { ticketId, title, content, images, type } = req.body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      throw { status: 400, message: "Minimal 1 gambar wajib" };
    }

    let portfolioData = {
      title,
      content,
      type
    };

    // ================= AUTO =================
    if (type === "auto") {

      if (!ticketId) {
        throw { status: 400, message: "ticketId wajib" };
      }

      const ticket = await Ticket.findById(ticketId);
      if (!ticket) throw { status: 404, message: "Ticket tidak ditemukan" };

      if (ticket.status !== "done") {
        throw { status: 400, message: "Ticket belum selesai" };
      }

      const existing = await Portfolio.findOne({ ticketId });
      if (existing) {
        throw { status: 400, message: "Portfolio sudah ada" };
      }

      const review = await Review.findOne({ ticketId });
      if (!review) {
        throw { status: 400, message: "Review belum ada" };
      }

      const detail = await DetailTicket.findOne({ ticketId });

      portfolioData = {
        ticketId,
        title: title || detail?.nama_acara,
        content: content || review.komentar,
        rating: review.rating,
        review: review.komentar,
        type: "auto"
      };
    }

    // ================= CREATE PORTFOLIO =================
    const portfolio = await Portfolio.create(portfolioData);

    // ================= CREATE FOTO PORTFOLIO =================
    const imageDocs = images.map((url, index) => ({
      portfolioId: portfolio._id,
      url,
      order: index + 1,
      caption: "Foto Hasil Dekorasi"
    }));

    await fotoPortfolio.insertMany(imageDocs);

    // LOG
    await logActivity({
      userId: req.user.id,
      action: "CREATE_PORTFOLIO",
      customDescription: `Portfolio ${portfolio.title} dibuat dengan ${images.length} gambar`
    });

    res.json({
      message: "Portfolio berhasil dibuat",
      portfolio,
      totalImages: images.length
    });

  } catch (err) {
    next(err);
  }
};



// GET ALL
export const getPortfolios = async (req, res, next) => {
  try {
    const data = await Portfolio.find({ isActive: true })
      .sort({ createdAt: -1 });

    res.json(data);

  } catch (err) {
    next(err);
  }
};



// GET DETAIL
export const getPortfolioById = async (req, res, next) => {
  try {
    const data = await Portfolio.findById(req.params.id);

    if (!data) throw { status: 404, message: "Portfolio tidak ditemukan" };

    res.json(data);

  } catch (err) {
    next(err);
  }
};



// UPDATE
export const updatePortfolio = async (req, res, next) => {
  try {
    const data = await Portfolio.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!data) throw { status: 404, message: "Portfolio tidak ditemukan" };

    await logActivity({
      userId: req.user.id,
      action: "UPDATE_PORTFOLIO",
      customDescription: `Admin mengupdate portfolio ${data.title}`
    });

    res.json(data);

  } catch (err) {
    next(err);
  }
};



// SOFT DELETE
export const deletePortfolio = async (req, res, next) => {
  try {
    const data = await Portfolio.findById(req.params.id);

    if (!data) throw { status: 404, message: "Portfolio tidak ditemukan" };

    data.isActive = false;
    await data.save();

    await logActivity({
      userId: req.user.id,
      action: "DELETE_PORTFOLIO",
      customDescription: `Admin menghapus portfolio ${data.title}`
    });

    res.json({ message: "Portfolio dihapus" });

  } catch (err) {
    next(err);
  }
};