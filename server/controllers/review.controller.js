import Review from "../models/review.js";
import Ticket from "../models/ticket.js";
import Voucher from "../models/voucher.js";
import Pelanggan from "../models/pelanggan.js";
import Layanan from "../models/layanan.js";
import { logActivity } from "../utils/logger.js";


// GENERATE CODE
const generateVoucherCode = () => {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `FLORA-${random}`;
};

// CREATE REVIEW + VOUCHER
export const createReview = async (req, res, next) => {
  try {
    const { ticketId, rating, komentar } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw { status: 404, message: "Ticket tidak ditemukan" };

    // hanya pelanggan pemilik
    const pelanggan = await Pelanggan.findOne({ userId: req.user.id });
    if (!pelanggan) throw { status: 404, message: "Pelanggan tidak ditemukan" };

    if (ticket.pelangganId.toString() !== pelanggan._id.toString()) {
      throw { status: 403, message: "Bukan ticket anda" };
    }

    // hanya jika selesai
    if (ticket.status !== "done") {
      throw { status: 400, message: "Review hanya bisa setelah selesai" };
    }

    // tidak boleh double
    const existing = await Review.findOne({ ticketId });
    if (existing) {
      throw { status: 400, message: "Review sudah ada" };
    }

    // ================= SAVE REVIEW =================
    const review = await Review.create({
      ticketId,
      pelangganId: pelanggan._id,
      rating,
      komentar
    });

    // ================= HITUNG CASHBACK =================
    const layanan = await Layanan.findById(ticket.layananId);

    const totalHarga = layanan.harga;
    const cashback = Math.floor(totalHarga * 0.05); // 5%

    // ================= CREATE VOUCHER =================
    const voucher = await Voucher.create({
      code: generateVoucherCode(),
      pelangganId: pelanggan._id,
      amount: cashback,
      expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 hari
    });

    // ================= LOG =================
    await logActivity({
      userId: req.user.id,
      ticketId,
      action: "CREATE_REVIEW",
      meta: {},
      customDescription: `Pelanggan memberikan review dan mendapatkan voucher ${voucher.code}`
    });

    res.json({
      message: "Review berhasil, voucher telah dibuat",
      review,
      voucher
    });

  } catch (err) {
    next(err);
  }
};


// GET REVIEW BY TICKET
export const getReviewByTicket = async (req, res, next) => {
  try {
    const data = await Review.findOne({
      ticketId: req.params.ticketId
    });

    res.json(data);

  } catch (err) {
    next(err);
  }
};

export const getAllReviews = async (req, res, next) => {
  try {
    const data = await Review.find()
    .populate("pelangganId", "nama")
    .populate({
      path: "ticketId",
      populate: {
        path: "layananId",
        select: "nama"
      }
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const toggleReviewStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) throw { status: 404, message: "Review tidak ditemukan" };

    review.isActive = !review.isActive;
    await review.save();

    await logActivity({
      userId: req.user.id,
      action: "TOGGLE_REVIEW",
      meta: { reviewId: id },
      customDescription: `Admin mengubah status review menjadi ${review.isActive}`
    });

    res.json({ message: "Status updated", review });
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndDelete(id);
    if (!review) throw { status: 404, message: "Review tidak ditemukan" };

    await logActivity({
      userId: req.user.id,
      action: "DELETE_REVIEW",
      meta: { reviewId: id },
      customDescription: "Admin menghapus review"
    });

    res.json({ message: "Review deleted" });
  } catch (err) {
    next(err);
  }
};