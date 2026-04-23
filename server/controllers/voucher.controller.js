import Voucher from "../models/voucher.js";
import Pelanggan from "../models/pelanggan.js";


// GET VOUCHER MILIK USER
export const getMyVouchers = async (req, res, next) => {
  try {
    const pelanggan = await Pelanggan.findOne({ userId: req.user.id });

    if (!pelanggan) {
      throw { status: 404, message: "Pelanggan tidak ditemukan" };
    }

    const vouchers = await Voucher.find({
      pelangganId: pelanggan._id
    }).sort({ createdAt: -1 });

    res.json({
      total: vouchers.length,
      data: vouchers
    });

  } catch (err) {
    next(err);
  }
};



// GET VOUCHER BY CODE
export const getVoucherByCode = async (req, res, next) => {
  try {
    const voucher = await Voucher.findOne({
      code: req.params.code
    });

    if (!voucher) {
      throw { status: 404, message: "Voucher tidak ditemukan" };
    }

    res.json(voucher);

  } catch (err) {
    next(err);
  }
};



// GET ALL VOUCHERS (ADMIN)
export const getAllVouchers = async (req, res, next) => {
  try {
    const data = await Voucher.find()
      .populate("pelangganId", "nama")
      .sort({ createdAt: -1 });

    res.json({
      total: data.length,
      data
    });

  } catch (err) {
    next(err);
  }
};