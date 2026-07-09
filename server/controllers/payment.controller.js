import Payment from "../models/payment.js";
import Ticket from "../models/ticket.js";
import Layanan from "../models/layanan.js";
import Pegawai from "../models/pegawai.js";
import Pelanggan from "../models/pelanggan.js";
import User from "../models/user.js";
import LogActivity from "../models/logAktivitas.js";
import { logActivity }from "../utils/logger.js";
import { sendEmail } from "../utils/emailer.js"

/* =========================================================
   CREATE PAYMENT (CUSTOMER)
========================================================= */

export const createPayment = async (req, res, next) => {
  try {
    const {ticketId, tipe, nama_pengirim, bank_pengirim} = req.body;

    /* VALIDASI TICKET */
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) throw { status: 404, message: "Ticket tidak ditemukan" };

    if (!["approved", "in_progress"].includes(ticket.status))
      throw { status: 400, message: "Ticket belum siap pembayaran" };

    /* VALIDASI LAYANAN */
    const layanan = await Layanan.findById(ticket.layananId);

    if (!layanan)
      throw { status: 404, message: "Layanan tidak ditemukan" };

    /* ================= AMBIL DATA PELANGGAN ================= */
    const pelanggan = await Pelanggan.findById(
      ticket.pelangganId
    );

    if (!pelanggan) {
      throw {
        status: 404,
        message: "Pelanggan tidak ditemukan",
      };
    }

     /* PAYMENT EXISTING */
    const payments = await Payment.find({ ticketId });

    const approvedPayments = payments.filter(
      (p) => p.status === "approved"
    );

    const approvedTypes = approvedPayments.map(
      (p) => p.tipe
    );

    /* VALIDASI FLOW */
    if (approvedTypes.includes("LUNAS"))
      throw {status: 400, message: "Ticket sudah lunas" };

    const pendingSameType = payments.find(
      (p) => p.tipe === tipe && p.status === "pending"
    );

    if (pendingSameType)
      throw {status: 400, message: `${tipe} masih menunggu approval`};

    if (tipe === "DP1" && approvedTypes.includes("DP1"))
      throw { status: 400, message: "DP1 sudah dibayar" };

    if (tipe === "DP2") {
      if (!approvedTypes.includes("DP1"))
        throw {status: 400, message: "DP1 belum di-approve"};

      if (approvedTypes.includes("DP2"))
        throw {status: 400, message: "DP2 sudah dibayar"};
    }

    if (tipe === "PELUNASAN") {
      if (
        !approvedTypes.includes("DP1") ||
        !approvedTypes.includes("DP2")
      )
        throw {status: 400,message: "DP1 & DP2 harus approved dulu"};

      if (approvedTypes.includes("PELUNASAN"))
        throw {status: 400, message: "Sudah lunas"};
    }

    if (tipe === "LUNAS" && approvedTypes.length > 0)
      throw {status: 400, message:"Tidak bisa bayar lunas karena sudah ada pembayaran sebelumnya"};

    /* HITUNG NOMINAL */
    const harga = layanan.harga;

    let jumlah = 0;

    if (tipe === "DP1") jumlah = harga * 0.2;
    if (tipe === "DP2") jumlah = harga * 0.3;
    if (tipe === "PELUNASAN") jumlah = harga * 0.5;
    if (tipe === "LUNAS") jumlah = harga;

    /* GAMBAR BUKTI BAYAR */
    let bukti_bayar = "";

    if (req.file?.filename) {
      bukti_bayar = `/uploads/payment/${req.file.filename}`;
    }

    /* CREATE PEMBAYARAN */
    const payment = await Payment.create({
      ticketId,
      tipe,
      jumlah,
      nama_pengirim,
      bank_pengirim,
      bukti_bayar,
    });

    /* CREATE LOG */
    await logActivity({
      userId: req.user.id,
      ticketId: ticket._id,
      action: "CREATE_PAYMENT",
      description: "Membuat pembayaran",
    });

    /* ================= EMAIL PELANGGAN ================= */

    await sendEmail({
      to: pelanggan.email,
      subject: `Pembayaran ${payment.tipe} Berhasil Dikirim`,
      title: "Bukti Pembayaran Berhasil Diterima",
      message: `Halo ${pelanggan.nama},

    Terima kasih, bukti pembayaran Anda telah berhasil kami terima.

    Detail pembayaran:

    • Ticket : ${ticket._id}
    • Layanan : ${layanan.nama}
    • Tahap : ${payment.tipe}
    • Nominal : Rp ${payment.jumlah.toLocaleString("id-ID")}
    • Status : Menunggu Verifikasi Admin

    Admin akan segera melakukan pengecekan terhadap pembayaran Anda.

    Anda akan menerima email kembali setelah pembayaran berhasil diverifikasi.`,
      ctaText: "Lihat Pembayaran",
      ctaUrl: `${process.env.APP_URL}/ticket/${ticket._id}`,
    });

    /* ================= EMAIL ADMIN ================= */

    const admins = await User.find({
      role: "admin",
      isActive: true,
    }).select("email");

    for (const admin of admins) {
      if (!admin.email) continue;

      await sendEmail({
        to: admin.email,
        subject: `Pembayaran ${payment.tipe} Menunggu Verifikasi`,
        title: "Pembayaran Baru Masuk",
        message: `Halo Admin,

    Terdapat pembayaran baru yang memerlukan verifikasi.

    Detail pembayaran:

    • Nama Pelanggan : ${pelanggan.nama}
    • Ticket : ${ticket._id}
    • Layanan : ${layanan.nama}
    • Tahap : ${payment.tipe}
    • Nominal : Rp ${payment.jumlah.toLocaleString("id-ID")}
    • Pengirim : ${nama_pengirim}
    • Bank : ${bank_pengirim}

    Silakan login ke dashboard admin untuk melakukan verifikasi pembayaran.`,
        ctaText: "Verifikasi Pembayaran",
        ctaUrl: `${process.env.APP_URL}/admin/payment`,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Pembayaran berhasil dikirim",
      data: payment,
    });

  } catch (err) {
    next(err);
  }
};

/* =========================================================
   REJECT PAYMENT
========================================================= */
export const rejectPayment = async (req, res, next) => {
  try {
    const { catatan } = req.body;

    const payment = await Payment.findById(req.params.id);

    if (!payment)
      throw { status: 404, message: "Payment tidak ditemukan" };

    payment.status = "rejected";
    payment.catatan = catatan.trim();

    await payment.save();

    /* ================= AMBIL DATA ================= */

    const ticket = await Ticket.findById(
      payment.ticketId
    );

    if (!ticket) {
      throw {
        status: 404,
        message: "Ticket tidak ditemukan",
      };
    }

    const pelanggan = await Pelanggan.findById(
      ticket.pelangganId
    );

    if (!pelanggan) {
      throw {
        status: 404,
        message: "Pelanggan tidak ditemukan",
      };
    }

    const layanan = await Layanan.findById(
      ticket.layananId
    );

    /* CREATE LOG */
    await LogActivity.create({
      ticketId: payment.ticketId,
      action: "PAYMENT_REJECTED",
      status: "rejected",
      description: catatan,
    });

    /* ================= EMAIL PELANGGAN ================= */

    try {

      await sendEmail({
        to: pelanggan.email,
        subject: `Pembayaran ${payment.tipe} Ditolak`,
        title: "Pembayaran Ditolak",
        message: `Halo ${pelanggan.nama},

    Mohon maaf, pembayaran ${payment.tipe} Anda belum dapat kami verifikasi.

    Detail pembayaran:

    • Ticket : ${ticket._id}
    • Layanan : ${layanan?.nama || "-"}
    • Tahap : ${payment.tipe}

    Alasan penolakan:

    ${catatan}

    Silakan melakukan upload ulang bukti pembayaran yang benar agar proses pemesanan dapat dilanjutkan.`,
        ctaText: "Upload Bukti Baru",
        ctaUrl: `${process.env.APP_URL}/ticket/${ticket._id}`,
      });

    } catch (err) {

      console.error(
        "EMAIL PAYMENT REJECT:",
        err.message
      );

    }

    return res.json({
      success: true,
      message: "Pembayaran berhasil ditolak",
    });

  } catch (err) {
    next(err);
  }
};

export const approvePayment = async (req, res, next) => {
  try {
    const { status, catatan } = req.body;

    if (!["approved", "rejected"].includes(status))
      throw { status: 400, message: "Status tidak valid" };

    const payment = await Payment.findById(req.params.id);

    if (!payment)
      throw { status: 404, message: "Payment tidak ditemukan" };

    if (payment.status !== "pending")
      throw { status: 400, message: "Payment sudah diproses" };

    const ticket = await Ticket.findById(payment.ticketId);

    /* ================= AMBIL DATA ================= */

    const pelanggan = await Pelanggan.findById(
      ticket.pelangganId
    );

    if (!pelanggan) {
      throw {
        status: 404,
        message: "Pelanggan tidak ditemukan",
      };
    }

    const layanan = await Layanan.findById(
      ticket.layananId
    );

    if (!layanan) {
      throw {
        status: 404,
        message: "Layanan tidak ditemukan",
      };
    }
    payment.status = status;
    payment.approvedBy = req.user.id;
    payment.approvedAt = new Date();
    payment.catatan = catatan || "";

    await payment.save();

    if (status === "approved") {
      const approvedPayments = await Payment.find({
        ticketId: payment.ticketId,
        status: "approved",
      });

      const types = approvedPayments.map((p) => p.tipe);

      const isLunasBertahap =
        types.includes("DP1") &&
        types.includes("DP2") &&
        types.includes("PELUNASAN");

      const isLunasSekali = types.includes("LUNAS");

      if (isLunasBertahap || isLunasSekali) {
        ticket.status = "in_progress";
        await ticket.save();
      }
    }

    /* CREATE LOG */
    await logActivity({
      userId: req.user.id,
      ticketId: ticket._id,
      action:
        status === "approved"
          ? "APPROVE_PAYMENT"
          : "REJECT_PAYMENT",
      description: `Payment ${payment.tipe} ${status}`,
    });

    /* ================= EMAIL PAYMENT APPROVED ================= */

    if (status === "approved") {

      let tahapBerikutnya = "";

      switch (payment.tipe) {

        case "DP1":
          tahapBerikutnya =
            "Pembayaran berikutnya adalah DP2 sesuai jadwal yang telah ditentukan.";
          break;

        case "DP2":
          tahapBerikutnya =
            "Silakan menunggu informasi mengenai persiapan acara dan pelunasan.";
          break;

        case "PELUNASAN":
          tahapBerikutnya =
            "Seluruh pembayaran telah selesai. Tim FLORALESS akan mempersiapkan dekorasi acara Anda.";
          break;

        case "LUNAS":
          tahapBerikutnya =
            "Pembayaran penuh telah diterima. Tim FLORALESS akan segera mempersiapkan acara Anda.";
          break;

        default:
          tahapBerikutnya = "";
      }

      try {

        await sendEmail({

          to: pelanggan.email,

          subject: `Pembayaran ${payment.tipe} Disetujui`,

          title: "Pembayaran Berhasil Diverifikasi",

          message: `Halo ${pelanggan.nama},

    Pembayaran ${payment.tipe} Anda telah berhasil diverifikasi oleh Admin.

    Detail pembayaran:

    • Ticket : ${ticket._id}
    • Layanan : ${layanan.nama}
    • Tahap : ${payment.tipe}
    • Nominal : Rp ${payment.jumlah.toLocaleString("id-ID")}

    ${tahapBerikutnya}

    Terima kasih telah melakukan pembayaran tepat waktu.`,

          ctaText: "Lihat Ticket",

          ctaUrl: `${process.env.APP_URL}/ticket/${ticket._id}`,

        });

      } catch (err) {

        console.error(
          "EMAIL PAYMENT APPROVED:",
          err.message
        );

      }

    }

    /* ================= EMAIL TICKET IN PROGRESS ================= */

    const pembayaranSelesai =
      ticket.status === "in_progress";

    if (status === "approved" && pembayaranSelesai) {

      try {

        await sendEmail({

          to: pelanggan.email,

          subject: "Pemesanan Anda Mulai Diproses",

          title: "Persiapan Acara Dimulai",

          message: `Halo ${pelanggan.nama},

    Seluruh pembayaran Anda telah berhasil diverifikasi.

    Tim FLORALESS kini mulai memasuki tahap persiapan dekorasi untuk acara Anda.

    Kami akan memastikan seluruh kebutuhan dekorasi dipersiapkan dengan sebaik mungkin hingga hari pelaksanaan.

    Terima kasih telah mempercayakan momen spesial Anda kepada FLORALESS.`,

          ctaText: "Lihat Status Ticket",

          ctaUrl: `${process.env.APP_URL}/ticket/${ticket._id}`,

        });

      } catch (err) {

        console.error(
          "EMAIL IN PROGRESS:",
          err.message
        );

      }

    }

  } catch (err) {
    next(err);
  }
};

/* =========================================================
   GET PAYMENT BY TICKET
========================================================= */

export const getPaymentsByTicket =
  async (
    req,
    res,
    next
  ) => {

    try {

      const data =
        await Payment.find({

          ticketId:
            req.params.ticketId,

        })

        .sort({
          createdAt: 1,
        });

      res.json(data);

    } catch (err) {

      next(err);
    }
  };

/* =========================================================
   GET PAYMENT BY ID
========================================================= */

export const getPaymentById =
  async (
    req,
    res,
    next
  ) => {

    try {

      const data =
        await Payment.findById(
          req.params.id
        );

      if (!data) {

        throw {

          status: 404,

          message:
            "Payment tidak ditemukan",
        };
      }

      res.json(data);

    } catch (err) {

      next(err);
    }
  };

/* =========================================================
   GET PAYMENTS
========================================================= */

export const getPayments =
  async (
    req,
    res,
    next
  ) => {

    try {

      const {

        page = 1,

        limit = 10,

        status,

      } = req.query;

      /* ===================================================
         FILTER
      =================================================== */

      let filter = {};

      if (status) {

        filter.status =
          status;
      }

      /* ===================================================
         FILTER PEGAWAI
      =================================================== */

      if (
        req.user.role ===
        "pegawai"
      ) {

        const pegawai =
          await Pegawai.findOne({

            userId:
              req.user.id,
          });

        if (!pegawai) {

          return res.status(404)
            .json({

              message:
                "Pegawai tidak ditemukan",
            });
        }

        /* ===================================================
           AMBIL TICKET PIC
        =================================================== */

        const tickets =
          await Ticket.find({

            pegawaiId:
              pegawai._id,
          }).select("_id");

        const ticketIds =
          tickets.map(
            (t) => t._id
          );

        /* ===================================================
           FILTER PAYMENT
        =================================================== */

        filter.ticketId = {
          $in: ticketIds,
        };
      }

      /* ===================================================
         QUERY PAYMENT
      =================================================== */

      const data =
        await Payment.find(
          filter
        )

        .populate({

          path: "ticketId",

          populate: [

            {

              path:
                "pelangganId",

              select:
                "nama no_telp",
            },

            {

              path:
                "layananId",

              select:
                "nama harga",
            },

            {

              path:
                "pegawaiId",

              select:
                "nama",
            },
          ],
        })

        .sort({
          createdAt: -1,
        })

        .skip(
          (Number(page) - 1) *
          Number(limit)
        )

        .limit(
          Number(limit)
        );

      /* ===================================================
         TOTAL
      =================================================== */

      const total =
        await Payment.countDocuments(
          filter
        );

      /* ===================================================
         RESPONSE
      =================================================== */

      return res.json({

        data,

        total,

        page:
          Number(page),

        totalPages:
          Math.ceil(
            total /
            Number(limit)
          ),
      });

    } catch (err) {

      next(err);
    }
  };