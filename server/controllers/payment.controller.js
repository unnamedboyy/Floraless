import Payment from "../models/payment.js";
import Ticket from "../models/ticket.js";
import Layanan from "../models/layanan.js";


// CREATE PAYMENT
export const createPayment = async (req, res, next) => {
  try {
    const { ticketId, tipe } = req.body;

  
    // VALIDASI TICKET
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw { status: 404, message: "Ticket tidak ditemukan" };

    if (ticket.status === "pending") {
      throw { status: 400, message: "Ticket belum di-approve" };
    }

  
    // AMBIL HARGA LAYANAN
    const layanan = await Layanan.findById(ticket.layananId);
    if (!layanan) throw { status: 404, message: "Layanan tidak ditemukan" };

    const harga = layanan.harga;

  
    // CEK PAYMENT SEBELUMNYA
    const existingPayments = await Payment.find({ ticketId });
    const paidTypes = existingPayments.map(p => p.tipe);

  
    // VALIDASI URUTAN
    if (tipe === "DP1" && paidTypes.includes("DP1")) {
      throw { status: 400, message: "DP1 sudah dibayar" };
    }

    if (tipe === "DP2") {
      if (!paidTypes.includes("DP1")) {
        throw { status: 400, message: "Harus bayar DP1 dulu" };
      }
      if (paidTypes.includes("DP2")) {
        throw { status: 400, message: "DP2 sudah dibayar" };
      }
    }

    if (tipe === "PELUNASAN") {
      if (!paidTypes.includes("DP1") || !paidTypes.includes("DP2")) {
        throw { status: 400, message: "Harus bayar DP1 & DP2 dulu" };
      }
      if (paidTypes.includes("PELUNASAN")) {
        throw { status: 400, message: "Sudah lunas" };
      }
    }

  
    // HITUNG NOMINAL
    let jumlah = 0;

    if (tipe === "DP1") jumlah = harga * 0.2;
    if (tipe === "DP2") jumlah = harga * 0.3;
    if (tipe === "PELUNASAN") jumlah = harga * 0.5;

  
    // CREATE PAYMENT
    const payment = await Payment.create({
      ticketId,
      tipe,
      jumlah
    });

  
    // AUTO UPDATE STATUS TICKET
    if (tipe === "PELUNASAN") {
      ticket.status = "in_progress";
      await ticket.save();
    }

    res.json({
      message: "Payment berhasil",
      payment
    });

  } catch (err) {
    next(err);
  }
};


// GET PAYMENT BY TICKET
export const getPaymentsByTicket = async (req, res, next) => {
  try {
    const data = await Payment.find({ ticketId: req.params.ticketId })
      .sort({ createdAt: 1 });

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