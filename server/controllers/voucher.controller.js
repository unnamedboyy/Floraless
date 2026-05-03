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

// CREATE VOUCHER (ADMIN)
export const createVoucher = async (req, res, next) => {
  try {
    const { code, pelangganId, amount, expiredAt } = req.body;

    const exist = await Voucher.findOne({ code });
    if (exist) throw { status: 400, message: "Code sudah ada" };

    const voucher = await Voucher.create({
      code,
      pelangganId,
      amount,
      expiredAt,
    });

    res.json(voucher);
  } catch (err) {
    next(err);
  }
};


// UPDATE VOUCHER
export const updateVoucher = async (req, res, next) => {
  try {
    const { id } = req.params;

    const voucher = await Voucher.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!voucher) {
      throw { status: 404, message: "Voucher tidak ditemukan" };
    }

    res.json(voucher);
  } catch (err) {
    next(err);
  }
};


// DELETE VOUCHER
export const deleteVoucher = async (req, res, next) => {
  try {
    const { id } = req.params;

    const voucher = await Voucher.findById(id);

    if (!voucher) {
      throw { status: 404, message: "Voucher tidak ditemukan" };
    }

    if (voucher.isUsed) {
      throw {
        status: 400,
        message: "Voucher sudah digunakan, tidak bisa dihapus"
      };
    }

    await voucher.deleteOne();

    res.json({ message: "Voucher dihapus" });
  } catch (err) {
    next(err);
  }
};