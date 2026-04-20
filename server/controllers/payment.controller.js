import Payment from "../models/payment.js";
import Ticket from "../models/ticket.js";
import Layanan from "../models/layanan.js";


// CREATE PAYMENT (USER)
export const createPayment = async (req, res, next) => {
  try {
    const { ticketId, tipe } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw { status: 404, message: "Ticket tidak ditemukan" };

    if (ticket.status !== "approved" && ticket.status !== "in_progress") {
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

    // ================= VALIDASI FLOW =================

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

    // ================= HITUNG NOMINAL =================

    let jumlah = 0;

    if (tipe === "DP1") jumlah = harga * 0.2;
    if (tipe === "DP2") jumlah = harga * 0.3;
    if (tipe === "PELUNASAN") jumlah = harga * 0.5;

    const payment = await Payment.create({
      ticketId,
      tipe,
      jumlah
    });

    res.json({
      message: "Payment dibuat, menunggu approval",
      payment
    });

  } catch (err) {
    next(err);
  }
};


// APPROVE / REJECT (PIC)
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

    // ================= VALIDASI PIC =================

    // if (ticket.pegawaiId?.toString() !== req.user.id) {
    //   throw { status: 403, message: "Hanya PIC yang bisa approve" };
    // }

    payment.status = status;
    payment.approvedBy = req.user.id;
    payment.approvedAt = new Date();
    payment.catatan = catatan;

    await payment.save();

    // ================= CEK LUNAS =================

    if (status === "approved") {
      const payments = await Payment.find({
        ticketId: payment.ticketId,
        status: "approved"
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
      payment
    });

  } catch (err) {
    next(err);
  }
};


// GET PAYMENT BY TICKET
export const getPaymentsByTicket = async (req, res, next) => {
  try {
    const data = await Payment.find({
      ticketId: req.params.ticketId
    }).sort({ createdAt: 1 });

    res.json(data);

  } catch (err) {
    next(err);
  }
};


// GET PAYMENT BY ID
export const getPaymentById = async (req, res, next) => {
  try {
    const data = await Payment.findById(req.params.id);

    if (!data) throw { status: 404, message: "Payment tidak ditemukan" };

    res.json(data);

  } catch (err) {
    next(err);
  }
};