import Voucher from "../models/voucher.js";
import Pelanggan from "../models/pelanggan.js";
import { sendEmail } from "../utils/emailer.js";

/* =====================================================
   GET MY VOUCHERS
===================================================== */

export const getMyVouchers =
  async (req, res, next) => {

    try {

      const pelanggan =
        await Pelanggan.findOne({

          userId: req.user.id
        });

      if (!pelanggan) {

        throw {

          status: 404,

          message:
            "Pelanggan tidak ditemukan"
        };
      }

      const vouchers =
        await Voucher.find({

          pelangganId:
            pelanggan._id

        }).sort({

          createdAt: -1
        });

      res.json({

        total:
          vouchers.length,

        data:
          vouchers
      });

    } catch (err) {

      next(err);
    }
  };

/* =====================================================
   GET BY CODE
===================================================== */

export const getVoucherByCode =
  async (req, res, next) => {

    try {

      const voucher =
        await Voucher.findOne({

          code:
            req.params.code
        });

      if (!voucher) {

        throw {

          status: 404,

          message:
            "Voucher tidak ditemukan"
        };
      }

      res.json(voucher);

    } catch (err) {

      next(err);
    }
  };

/* =====================================================
   GET ALL
===================================================== */

export const getAllVouchers =
  async (req, res, next) => {

    try {

      const page =
        Number(req.query.page) || 1;

      const limit =
        Number(req.query.limit) || 10;

      const skip =
        (page - 1) * limit;

      const search =
        req.query.search || "";

      let filter = {};

      /* ================= SEARCH ================= */

      if (search) {

        filter.code = {

          $regex: search,

          $options: "i",
        };
      }

      /* ================= STATUS ================= */

      if (
        req.query.status !==
        undefined &&
        req.query.status !== ""
      ) {

        filter.isUsed =
          req.query.status === "true";
      }

      /* ================= TOTAL ================= */

      const total =
        await Voucher.countDocuments(
          filter
        );

      /* ================= DATA ================= */

      const data =
        await Voucher.find(filter)

          .populate(
            "pelangganId",
            "nama"
          )

          .sort({
            createdAt: -1,
          })

          .skip(skip)

          .limit(limit);

      res.json({

        total,

        page,

        limit,

        data,
      });

    } catch (err) {

      next(err);
    }
  };

/* =====================================================
   CREATE
===================================================== */

export const createVoucher = async (req, res, next) => {
  try {
    const { code, pelangganId, amount, expiredAt } = req.body;

    if (!code?.trim())
      throw { status: 400, message: "Kode voucher wajib diisi" };

    if (code.trim().length < 3)
      throw {
        status: 400,
        message: "Kode voucher minimal 3 karakter",
      };

    if (!pelangganId)
      throw {
        status: 400,
        message: "Pelanggan wajib dipilih",
      };

    if (!amount || Number(amount) <= 0)
      throw {
        status: 400,
        message: "Nominal voucher tidak valid",
      };

    if (!expiredAt)
      throw {
        status: 400,
        message: "Tanggal expired wajib diisi",
      };

    const voucherCode = code.trim().toUpperCase();

    const exist = await Voucher.findOne({
      code: voucherCode,
    });

    if (exist)
      throw {
        status: 400,
        message: "Kode voucher sudah digunakan",
      };

    const voucher = await Voucher.create({
      code: voucherCode,
      pelangganId,
      amount,
      expiredAt,
    });

    /* ================= AMBIL DATA PELANGGAN ================= */

    const pelanggan = await Pelanggan.findById(pelangganId);

    if (pelanggan?.email) {
      await sendEmail({
        to: pelanggan.email,
        subject: "🎉 Selamat! Anda Mendapatkan Voucher FLORALESS",
        title: "Voucher Berhasil Diberikan",
        message: `Halo ${pelanggan.nama},

Selamat! Anda mendapatkan voucher spesial dari FLORALESS.

Detail voucher Anda:

• Kode Voucher : ${voucher.code}
• Nominal Voucher : Rp ${Number(voucher.amount).toLocaleString("id-ID")}
• Berlaku Hingga : ${new Date(voucher.expiredAt).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}

Voucher ini dapat digunakan pada transaksi sesuai dengan ketentuan yang berlaku.

Terima kasih telah mempercayakan kebutuhan dekorasi Anda kepada FLORALESS. Semoga voucher ini dapat memberikan pengalaman yang lebih menyenangkan untuk pemesanan Anda berikutnya.`,
        ctaText: "Gunakan Voucher",
        ctaUrl: `${process.env.APP_URL}/voucher`,
      });
    }

    res.json(voucher);
  } catch (err) {
    next(err);
  }
};

/* =====================================================
   UPDATE
===================================================== */

export const updateVoucher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {code,pelangganId, amount,expiredAt} = req.body;
    const voucher = await Voucher.findById(id);

    if (!voucher) throw { status: 404, message: "Voucher tidak ditemukan" };
    if (voucher.isUsed) throw { status: 400, message: "Voucher yang sudah digunakan tidak bisa diedit"};
    if (!code?.trim()) throw { status: 400, message: "Kode voucher wajib diisi"};
    if (!pelangganId) throw {status: 400,message: "Pelanggan wajib dipilih"};
    if (!amount || Number(amount) <= 0) throw {status: 400,message: "Nominal voucher tidak valid"};

    const voucherCode = code.trim().toUpperCase();
    const duplicate = await Voucher.findOne({_id: { $ne: id }, code: voucherCode});

    if (duplicate) throw {status: 400,message: "Kode voucher sudah digunakan"};

    voucher.code = voucherCode;
    voucher.pelangganId = pelangganId;
    voucher.amount = amount;
    voucher.expiredAt = expiredAt;

    await voucher.save();
    res.json(voucher);

  } catch (err) {
    next(err);
  }
};

/* =====================================================
   DELETE
===================================================== */

export const deleteVoucher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const voucher = await Voucher.findById(id);

    if (!voucher) throw { status: 404, message: "Voucher tidak ditemukan" };
    if (voucher.isUsed) throw { status: 400,message: "Voucher sudah digunakan, tidak bisa dihapus"};

    await voucher.deleteOne();

    res.json({
      message: "Voucher berhasil dihapus",
    });

  } catch (err) {
    next(err);
  }
};