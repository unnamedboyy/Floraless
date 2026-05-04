import Payment from "../models/payment.js";
import Ticket from "../models/ticket.js";
import Layanan from "../models/layanan.js";
import Pegawai from "../models/pegawai.js";
import { logActivity } from "../utils/logger.js";

/* ================= CREATE PAYMENT (PELANGGAN) ================= */

export const createPayment = async (req, res, next) => {
  try {
    const { ticketId, tipe } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw { status: 404, message: "Ticket tidak ditemukan" };

    if (!["approved", "in_progress"].includes(ticket.status)) {
      throw { status: 400, message: "Ticket belum siap pembayaran" };
    }

    const layanan = await Layanan.findById(ticket.layananId);
    if (!layanan) throw { status: 404, message: "Layanan tidak ditemukan" };

    const harga = layanan.harga;

    const payments = await Payment.find({ ticketId });

    const approvedPayments = payments.filter(p => p.status === "approved");
    const approvedTypes = approvedPayments.map(p => p.tipe);

    const pendingSameType = payments.find(
      p => p.tipe === tipe && p.status === "pending"
    );

    if (pendingSameType) {
      throw { status: 400, message: `${tipe} masih menunggu approval` };
    }

    /* ================= VALIDASI FLOW ================= */

    if (tipe === "DP1" && approvedTypes.includes("DP1")) {
      throw { status: 400, message: "DP1 sudah dibayar" };
    }

    if (tipe === "DP2") {
      if (!approvedTypes.includes("DP1")) {
        throw { status: 400, message: "DP1 belum di-approve" };
      }
      if (approvedTypes.includes("DP2")) {
        throw { status: 400, message: "DP2 sudah dibayar" };
      }
    }

    if (tipe === "PELUNASAN") {
      if (!approvedTypes.includes("DP1") || !approvedTypes.includes("DP2")) {
        throw { status: 400, message: "DP1 & DP2 harus approved dulu" };
      }
      if (approvedTypes.includes("PELUNASAN")) {
        throw { status: 400, message: "Sudah lunas" };
      }
    }

    /* ================= HITUNG NOMINAL ================= */

    let jumlah = 0;

    if (tipe === "DP1") jumlah = harga * 0.2;
    if (tipe === "DP2") jumlah = harga * 0.3;
    if (tipe === "PELUNASAN") jumlah = harga * 0.5;

    const payment = await Payment.create({
      ticketId,
      tipe,
      jumlah,
    });

    await logActivity({
      userId: req.user.id,
      ticketId: ticket._id,
      action: "CREATE_PAYMENT",
      meta: { tipe },
    });

    res.json({
      message: "Payment dibuat, menunggu approval",
      payment,
    });

  } catch (err) {
    next(err);
  }
};

/* ================= APPROVE / REJECT (PEGAWAI PIC) ================= */

export const approvePayment = async (req, res, next) => {
  try {
    const { status, catatan } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      throw { status: 400, message: "Status harus approved/rejected" };
    }

    const payment = await Payment.findById(req.params.id);
    if (!payment) throw { status: 404, message: "Payment tidak ditemukan" };

    if (payment.status !== "pending") {
      throw { status: 400, message: "Payment sudah diproses" };
    }

    const ticket = await Ticket.findById(payment.ticketId);

    /* ================= VALIDASI PIC ================= */

    const pegawai = await Pegawai.findOne({
      userId: req.user.id,
    });

    if (!pegawai) {
      throw { status: 404, message: "Pegawai tidak ditemukan" };
    }

    if (ticket.pegawaiId?.toString() !== pegawai._id.toString()) {
      throw { status: 403, message: "Hanya PIC yang bisa approve" };
    }

    /* ================= UPDATE PAYMENT ================= */

    payment.status = status;
    payment.approvedBy = pegawai._id;
    payment.approvedAt = new Date();
    payment.catatan = catatan;

    await payment.save();

    /* ================= LOG ================= */

    await logActivity({
      userId: req.user.id,
      ticketId: ticket._id,
      action: status === "approved" ? "APPROVE_PAYMENT" : "REJECT_PAYMENT",
      meta: { tipe: payment.tipe },
    });

    /* ================= AUTO UPDATE TICKET ================= */

    if (status === "approved") {
      const payments = await Payment.find({
        ticketId: payment.ticketId,
        status: "approved",
      });

      const types = payments.map(p => p.tipe);

      if (
        types.includes("DP1") &&
        types.includes("DP2") &&
        types.includes("PELUNASAN")
      ) {
        ticket.status = "in_progress";
        await ticket.save();
      }
    }

    res.json({
      message: `Payment ${status}`,
      payment,
    });

  } catch (err) {
    next(err);
  }
};

/* ================= GET PAYMENT BY TICKET ================= */

export const getPaymentsByTicket = async (req, res, next) => {
  try {
    const data = await Payment.find({
      ticketId: req.params.ticketId,
    }).sort({ createdAt: 1 });

    res.json(data);
  } catch (err) {
    next(err);
  }
};

/* ================= GET PAYMENT BY ID ================= */

export const getPaymentById = async (req, res, next) => {
  try {
    const data = await Payment.findById(req.params.id);

    if (!data) throw { status: 404, message: "Payment tidak ditemukan" };

    res.json(data);
  } catch (err) {
    next(err);
  }
};

/* ================= GET PAYMENTS (LIST) ================= */

export const getPayments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    let filter = {};

    if (status) {
      filter.status = status;
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

      const ticketIds = tickets.map(t => t._id);

      filter.ticketId = { $in: ticketIds };
    }

    /* ================= QUERY ================= */

    const data = await Payment.find(filter)
      .populate({
        path: "ticketId",
        populate: {
          path: "pelangganId",
          select: "nama",
        },
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Payment.countDocuments(filter);

    res.json({
      data,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });

  } catch (err) {
    next(err);
  }
};