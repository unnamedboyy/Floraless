import Voucher from "../models/voucher.js";
import CashbackClaim from "../models/cashbackClaim.js";
import Pelanggan from "../models/pelanggan.js";
import { logActivity } from "../utils/logger.js";


// 🔥 CREATE CLAIM (USER)
export const createClaim = async (req, res, next) => {
  try {
    const { code, nama_rekening, nomor_rekening, bank } = req.body;

    const pelanggan = await Pelanggan.findOne({ userId: req.user.id });
    if (!pelanggan) throw { status: 404, message: "Pelanggan tidak ditemukan" };

    const voucher = await Voucher.findOne({ code });

    if (!voucher) throw { status: 404, message: "Voucher tidak ditemukan" };

    if (voucher.pelangganId.toString() !== pelanggan._id.toString()) {
      throw { status: 403, message: "Voucher bukan milik anda" };
    }

    if (voucher.isUsed) {
      throw { status: 400, message: "Voucher sudah digunakan" };
    }

    if (voucher.expiredAt && voucher.expiredAt < new Date()) {
      throw { status: 400, message: "Voucher sudah expired" };
    }

    const existing = await CashbackClaim.findOne({
      voucherId: voucher._id,
      status: "pending"
    });

    if (existing) {
      throw { status: 400, message: "Voucher sedang dalam proses klaim" };
    }

    const claim = await CashbackClaim.create({
      voucherId: voucher._id,
      pelangganId: pelanggan._id,
      kode_voucher: voucher.code,
      nama_rekening,
      nomor_rekening,
      bank
    });

    // LOG
    await logActivity({
      userId: req.user.id,
      action: "CREATE_CLAIM",
      customDescription: `Pelanggan membuat klaim cashback dengan kode ${voucher.code}`
    });

    res.json({
      message: "Klaim berhasil dibuat, menunggu approval",
      claim
    });

  } catch (err) {
    next(err);
  }
};



// 🔥 APPROVE / REJECT (PEGAWAI)
export const processClaim = async (req, res, next) => {
  try {
    const { status, alasan, bukti_tf } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      throw { status: 400, message: "Status harus approved/rejected" };
    }

    const claim = await CashbackClaim.findById(req.params.id)
      .populate("voucherId");

    if (!claim) throw { status: 404, message: "Claim tidak ditemukan" };

    if (claim.status !== "pending") {
      throw { status: 400, message: "Claim sudah diproses" };
    }

    if (status === "rejected" && !alasan) {
      throw { status: 400, message: "Alasan wajib diisi" };
    }

    if (status === "approved" && !bukti_tf) {
      throw { status: 400, message: "Bukti transfer wajib" };
    }

    claim.status = status;
    claim.alasan = alasan;
    claim.bukti_tf = bukti_tf;
    claim.approvedBy = req.user.id;
    claim.approvedAt = new Date();

    await claim.save();

    // UPDATE VOUCHER
    if (status === "approved") {
      claim.voucherId.isUsed = true;
      await claim.voucherId.save();
    }

    // LOG
    await logActivity({
      userId: req.user.id,
      action: "PROCESS_CLAIM",
      customDescription:
        status === "approved"
          ? `Pegawai menyetujui klaim voucher ${claim.kode_voucher}`
          : `Pegawai menolak klaim voucher ${claim.kode_voucher} karena ${alasan}`
    });

    res.json({
      message: `Claim ${status}`,
      claim
    });

  } catch (err) {
    next(err);
  }
};


// GET CLAIM USER
export const getMyClaims = async (req, res, next) => {
  try {
    const pelanggan = await Pelanggan.findOne({ userId: req.user.id });

    const data = await CashbackClaim.find({
      pelangganId: pelanggan._id
    }).sort({ createdAt: -1 });

    res.json(data);

  } catch (err) {
    next(err);
  }
};

// GET ALL CLAIM (ADMIN/PEGAWAI)
export const getAllClaims = async (req, res, next) => {
  try {
    const data = await CashbackClaim.find()
      .populate("pelangganId", "nama")
      .sort({ createdAt: -1 });

    res.json(data);

  } catch (err) {
    next(err);
  }
};