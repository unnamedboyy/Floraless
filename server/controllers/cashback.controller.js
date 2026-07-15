import Voucher from "../models/voucher.js";
import CashbackClaim from "../models/cashbackClaim.js";
import Pelanggan from "../models/pelanggan.js";
import Ticket from "../models/ticket.js";
import Pegawai from "../models/pegawai.js";
import Admin from "../models/admin.js";
import { logActivity } from "../utils/logger.js";
import { sendEmail } from "../utils/emailer.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* ================= CREATE CLAIM (PELANGGAN) ================= */

export const createClaim = async (req, res, next) => {
  try {
    const pelanggan = await Pelanggan.findOne({
      userId: req.user.id,
    });

    if (!pelanggan)
      throw { status: 404, message: "Pelanggan tidak ditemukan" };

    const {
      voucherCode,
      code,
      bank,
      nomor_rekening,
      nama_rekening,
    } = req.body;

    const finalCode = voucherCode || code || "";

    if (!finalCode)
      throw { status: 400, message: "Kode voucher wajib diisi" };

    const voucher = await Voucher.findOne({
      code: finalCode.trim(),
    });

    if (!voucher)
      throw { status: 404, message: "Voucher tidak ditemukan" };

    if (voucher.isUsed)
      throw { status: 400, message: "Voucher sudah digunakan" };

    if (voucher.pelangganId.toString() !== pelanggan._id.toString())
      throw { status: 403, message: "Voucher bukan milik Anda" };

    if (voucher.expiredAt && new Date(voucher.expiredAt) < new Date())
      throw { status: 400, message: "Voucher sudah expired" };

    const existingClaim = await CashbackClaim.findOne({
      voucherId: voucher._id,
    });

    if (existingClaim)
      throw { status: 400, message: "Voucher sudah pernah diclaim" };

    const claim = await CashbackClaim.create({
      voucherId: voucher._id,
      pelangganId: pelanggan._id,
      kode_voucher: voucher.code,
      amount: voucher.amount,
      bank,
      nomor_rekening,
      nama_rekening,
      status: "pending",
    });

    voucher.isUsed = true;
    await voucher.save();

    /* ================= EMAIL PELANGGAN ================= */

    if (pelanggan.email) {
      await sendEmail({
        to: pelanggan.email,
        subject: "Pengajuan Cashback Berhasil Dikirim",
        title: "Pengajuan Cashback Berhasil Diterima",
        message: `Halo ${pelanggan.nama},

    Terima kasih, pengajuan cashback Anda telah berhasil kami terima.

    Detail pengajuan:

    • Kode Voucher : ${voucher.code}
    • Nominal Cashback : Rp ${voucher.amount.toLocaleString("id-ID")}
    • Bank Tujuan : ${bank}
    • Nomor Rekening : ${nomor_rekening}
    • Nama Rekening : ${nama_rekening}

    Status pengajuan saat ini:
    Menunggu verifikasi dari Admin.

    Kami akan segera memproses pengajuan Anda dan mengirimkan pemberitahuan setelah proses selesai.`,
        ctaText: "Lihat Pengajuan",
        ctaUrl: `${process.env.APP_URL}/cashback`,
      });
    }

    await delay(1000);
    /* ================= EMAIL ADMIN ================= */

    const admins = await Admin.find().select("email");

    const adminEmails = admins
      .map((admin) => admin.email)
      .filter(Boolean);

    if (adminEmails.length) {
      await sendEmail({
        to: adminEmails,
        subject: "Pengajuan Cashback Baru",
        title: "Pengajuan Cashback Baru Masuk",
        message: `Halo Admin,

    Terdapat pengajuan cashback baru yang memerlukan verifikasi.

    Detail pengajuan:

    • Nama Pelanggan : ${pelanggan.nama}
    • Kode Voucher : ${voucher.code}
    • Nominal Cashback : Rp ${voucher.amount.toLocaleString("id-ID")}
    • Bank : ${bank}
    • Nomor Rekening : ${nomor_rekening}
    • Nama Rekening : ${nama_rekening}

    Silakan login ke dashboard untuk memproses pengajuan cashback pelanggan.`,
        ctaText: "Verifikasi Cashback",
        ctaUrl: `${process.env.APP_URL}/admin/cashback`,
      });
    }

    await delay(1000);
    /* ================= EMAIL PEGAWAI PIC ================= */

    const ticket = await Ticket.findOne({
      pelangganId: pelanggan._id,
    })
      .sort({ createdAt: -1 })
      .populate("pegawaiId");

    if (ticket?.pegawaiId?.email) {
      await delay(1000);

      await sendEmail({
        to: ticket.pegawaiId.email,
        subject: "Pelanggan Mengajukan Cashback",
        title: "Pengajuan Cashback Pelanggan",
        message: `Halo ${ticket.pegawaiId.nama},

    Pelanggan yang menjadi tanggung jawab Anda telah mengajukan cashback.

    Detail:

    • Nama Pelanggan : ${pelanggan.nama}
    • Kode Voucher : ${voucher.code}
    • Nominal Cashback : Rp ${voucher.amount.toLocaleString("id-ID")}

    Pengajuan saat ini sedang menunggu proses verifikasi dari Admin.`,
        ctaText: "Lihat Detail",
        ctaUrl: `${process.env.APP_URL}/pegawai/cashback`,
      });
    }

  } catch (err) {
    next(err);
  }
};

export const processClaim = async (req, res, next) => {
  try {
    const { status, alasan, bukti_tf } = req.body;

    if (!["approved", "rejected"].includes(status))
      throw {
        status: 400,
        message: "Status harus approved/rejected",
      };

    const claim = await CashbackClaim.findById(req.params.id)
      .populate("voucherId");

    if (!claim)
      throw { status: 404, message: "Claim tidak ditemukan" };

    if (claim.status !== "pending")
      throw { status: 400, message: "Claim sudah diproses" };

    if (status === "rejected" && !alasan)
      throw { status: 400, message: "Alasan wajib diisi" };

    if (status === "approved" && !bukti_tf)
      throw { status: 400, message: "Bukti transfer wajib" };

    if (req.user.role === "pegawai") {
      const pegawai = await Pegawai.findOne({
        userId: req.user.id,
      });

      if (!pegawai)
        throw { status: 404, message: "Pegawai tidak ditemukan" };

      const ticket = await Ticket.findOne({
        pelangganId: claim.pelangganId,
        pegawaiId: pegawai._id,
      });

      if (!ticket)
        throw {
          status: 403,
          message: "Bukan PIC dari pelanggan ini",
        };
    }

    claim.status = status;
    claim.alasan = alasan;
    claim.bukti_tf = bukti_tf;
    claim.approvedBy = req.user.id;
    claim.approvedAt = new Date();

    await claim.save();

    if (status === "approved") {
      claim.voucherId.isUsed = true;
      await claim.voucherId.save();

      if (pelanggan?.email) {
        await sendEmail({
          to: pelanggan.email,
          subject: "Cashback Anda Telah Disetujui",
          title: "Pengajuan Cashback Disetujui",
          message: `Halo ${pelanggan.nama},

    Selamat! Pengajuan cashback Anda telah disetujui.

    Detail cashback:

    • Kode Voucher : ${claim.kode_voucher}
    • Nominal Cashback : Rp ${claim.amount.toLocaleString("id-ID")}

    Dana cashback telah diproses sesuai rekening yang Anda daftarkan.

    Terima kasih telah menggunakan layanan FLORALESS.`,
          ctaText: "Lihat Pengajuan",
          ctaUrl: `${process.env.APP_URL}/cashback`,
        });
      }
    }
    
    if (status === "rejected") {
      if (pelanggan?.email) {
        await sendEmail({
          to: pelanggan.email,
          subject: "Pengajuan Cashback Ditolak",
          title: "Pengajuan Cashback Belum Dapat Diproses",
          message: `Halo ${pelanggan.nama},

    Mohon maaf, pengajuan cashback Anda belum dapat kami setujui.

    Detail pengajuan:

    • Kode Voucher : ${claim.kode_voucher}
    • Nominal Cashback : Rp ${claim.amount.toLocaleString("id-ID")}

    Alasan penolakan:

    ${alasan}

    Silakan lakukan pengajuan kembali apabila diperlukan atau hubungi Admin FLORALESS apabila membutuhkan informasi lebih lanjut.`,
          ctaText: "Lihat Pengajuan",
          ctaUrl: `${process.env.APP_URL}/cashback`,
        });
      }
    }

  } catch (err) {
    next(err);
  }
};

/* ================= GET CLAIM USER ================= */

export const getMyClaims = async (req, res, next) => {
  try {
    const pelanggan = await Pelanggan.findOne({
      userId: req.user.id,
    });

    if (!pelanggan)
      throw { status: 404, message: "Pelanggan tidak ditemukan" };

    const data = await CashbackClaim.find({
      pelangganId: pelanggan._id,
    }).sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    next(err);
  }
};

/* ================= GET ALL CLAIM (ADMIN / PEGAWAI) ================= */

export const getAllClaims = async (req, res, next) => {
  try {

    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 10;

    const skip =
      (page - 1) * limit;

    const search =
      req.query.search || "";

    const status =
      req.query.status || "";

    let filter = {};

    /* ================= FILTER STATUS ================= */

    if (status) {
      filter.status = status;
    }

    /* ================= FILTER SEARCH ================= */

    if (search) {
      filter.kode_voucher = {
        $regex: search,
        $options: "i",
      };
    }

    /* ================= FILTER PEGAWAI ================= */

    if (req.user.role === "pegawai") {

      const pegawai = await Pegawai.findOne({
        userId: req.user.id,
      });

      if (!pegawai) {
        return res.status(404).json({
          message: "Pegawai tidak ditemukan",
        });
      }

      const tickets = await Ticket.find({
        pegawaiId: pegawai._id,
      });

      const pelangganIds =
        tickets.map((t) => t.pelangganId);

      filter.pelangganId = {
        $in: pelangganIds,
      };
    }

    /* ================= TOTAL ================= */

    const total =
      await CashbackClaim.countDocuments(
        filter
      );

    /* ================= DATA ================= */

    const data =
      await CashbackClaim.find(filter)

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