import mongoose from "mongoose";
import Ticket from "../models/ticket.js";
import DetailTicket from "../models/detailTicket.js";
import Jadwal from "../models/jadwal.js";
import Pelanggan from "../models/pelanggan.js";
import Layanan from "../models/layanan.js";
import Pegawai from "../models/pegawai.js";
import Payment from "../models/payment.js";
import Review from "../models/review.js";
import CashbackClaim from "../models/cashbackClaim.js";
import LogActivity from "../models/logAktivitas.js";

// CREATE TICKET
export const createTicket = async (req, res, next) => {
  try {
    const { pelangganId, layananId, tanggal, lokasi, nama_acara } = req.body;

    // VALIDASI ID
    if (!mongoose.Types.ObjectId.isValid(pelangganId)) {
      throw { status: 400, message: "pelangganId tidak valid" };
    }

    if (!mongoose.Types.ObjectId.isValid(layananId)) {
      throw { status: 400, message: "layananId tidak valid" };
    }

    // VALIDASI DATA
    const pelanggan = await Pelanggan.findById(pelangganId);
    if (!pelanggan) throw { status: 404, message: "Pelanggan tidak ditemukan" };

    const layanan = await Layanan.findById(layananId);
    if (!layanan) throw { status: 404, message: "Layanan tidak ditemukan" };

  
    // CEK BENTROK
    const bentrok = await Jadwal.findOne({
      tanggal_acara: new Date(tanggal)
    });

    if (bentrok) {
      throw {
        status: 400,
        message: "Tanggal sudah dibooking"
      };
    }

    // CREATE TICKET
    const ticket = await Ticket.create({
      pelangganId,
      layananId,
      status: "pending"
    });

    // DETAIL TICKET
    const detail = await DetailTicket.create({
      ticketId: ticket._id,
      tanggal_acara: tanggal,
      lokasi,
      nama_acara
    });

    // JADWAL
    await Jadwal.create({
      ticketId: ticket._id,
      tanggal_acara: tanggal,
      status: "booked"
    });

    // HISTORY
  await LogActivity.create({
    ticketId: ticket._id,
    action: "CREATE_TICKET",
    status: "pending",
    description: "Ticket dibuat"
  });

    res.json({
      message: "Ticket berhasil dibuat",
      ticket,
      detail
    });

  } catch (err) {
    next(err);
  }
};

// GET ALL TICKET
export const getTickets = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      tanggal,
      search
    } = req.query;

    let filter = {};

    if (req.user.role === "pelanggan") {
      filter.pelangganId = req.user.id;
    }

    if (req.user.role === "pegawai") {
      const pegawai = await Pegawai.findOne({
        userId: req.user.id,
      });

      if (!pegawai) {
        return res.status(404).json({
          message: "Pegawai tidak ditemukan",
        });
      }

      filter.pegawaiId = pegawai._id;
    }

    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    let tickets = await Ticket.find(filter)
      .populate("pelangganId", "nama")
      .populate("layananId", "nama harga")
      .populate("pegawaiId", "nama")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

      if (tanggal) {
      const jadwals = await Jadwal.find({
        tanggal_acara: new Date(tanggal)
      });

      const ticketIds = jadwals.map(j => j.ticketId.toString());

      tickets = tickets.filter(t =>
        ticketIds.includes(t._id.toString())
      );
    }

    const total = await Ticket.countDocuments(filter);

    res.json({
      data: tickets,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    });

  } catch (err) {
    next(err);
  }
};

// GET BY ID
export const getTicketById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id)
      .populate("pelangganId", "nama no_telp")
      .populate("layananId", "nama harga")
      .populate("pegawaiId", "nama");

    if (!ticket) throw { status: 404, message: "Ticket tidak ditemukan" };

    const summary = await getPaymentSummary(ticket);
    const detail = await DetailTicket.findOne({ ticketId: id });
    const jadwal = await Jadwal.findOne({ ticketId: id });
    const logs = await LogActivity.find({ ticketId: id }).sort({ createdAt: 1 });
    
      res.json({
      ticket,
      detail,
      jadwal,
      logs,
      summary
    });

  } catch (err) {
    next(err);
  }
};

// APPROVE (ASSIGN PIC)
export const approveTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { pegawaiId } = req.body;

    if (!pegawaiId) {
      return res.status(400).json({ message: "pegawaiId wajib diisi" });
    }

    const updated = await Ticket.findByIdAndUpdate(
      id,
      {
        pegawaiId,
        status: "approved",
      },
      { new: true }
    )
      .populate("pegawaiId", "nama")
      .populate("pelangganId", "nama")
      .populate("layananId", "nama harga");

    if (!updated) {
      return res.status(404).json({ message: "Ticket tidak ditemukan" });
    }

    res.json(updated); 
  } catch (err) {
    console.error("APPROVE ERROR:", err);
    next(err);
  }
};

// UPDATE STATUS (perlu saya lihat lagi flownya kaya gimana, soalnya statusnya banyak)
export const updateStatusTicket = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const allowedStatus = ["pending", "approved", "in_progress", "done", "rejected"];

    if (!allowedStatus.includes(status)) {
      throw { status: 400, message: "Status tidak valid" };
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) throw { status: 404, message: "Ticket tidak ditemukan" };

    // VALIDASI FLOWS
    const flow = {
      pending: ["approved", "rejected"],
      approved: ["in_progress"],
      in_progress: ["done"],
      done: [],
      rejected: []
    };

    const current = ticket.status;

    if (!flow[current].includes(status)) {
      throw {
        status: 400,
        message: `Tidak bisa mengubah status dari ${current} ke ${status}`
      };
    }

    // UPDATE STATUS
    ticket.status = status;
    await ticket.save();

    // HISTORY LOG
    await LogActivity.create({
      ticketId: ticket._id,
      action: "UPDATE_STATUS",
      status,
      description: `Status diubah ke ${status}`
    });

    res.json({
      message: "Status berhasil diupdate",
      ticket
    });

  } catch (err) {
    next(err);
  }
};

// 💰 PAYMENT SUMMARY
const getPaymentSummary = async (ticket) => {

  // ambil harga layanan
  const layanan = await Layanan.findById(ticket.layananId);
  if (!layanan) {
    throw { status: 404, message: "Layanan tidak ditemukan" };
  }

  const totalTagihan = layanan.harga;
  const payments = await Payment.find({
    ticketId: ticket._id,
    status: "approved"
  });

  const totalDibayar = payments.reduce(
    (sum, p) => sum + p.jumlah,
    0
  );

  const sisaTagihan = totalTagihan - totalDibayar;
  let statusPembayaran = "unpaid";

  if (totalDibayar === 0) {
    statusPembayaran = "unpaid";
  } else if (totalDibayar < totalTagihan) {
    statusPembayaran = "partial";
  } else if (totalDibayar === totalTagihan) {
    statusPembayaran = "paid";
  }

  return {
    totalTagihan,
    totalDibayar,
    sisaTagihan,
    statusPembayaran,
    jumlahPembayaran: payments.length
  };
};

export const getPaymentSummaryByTicket = async (req, res, next) => {
  try {

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) throw { status: 404, message: "Ticket tidak ditemukan" };

    const summary = await getPaymentSummary(ticket);
    res.json(summary);

  } catch (err) {
    next(err);
  }
};

// GET FULL DETAIL BY ID (TICKET + DETAIL + JADWAL + PAYMENT + REVIEW + VOUCHER + CLAIMS)
export const getTicketFullById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // ================= TICKET =================
    const ticket = await Ticket.findById(id)
      .populate("pelangganId", "nama no_telp")
      .populate("pegawaiId", "nama")
      .populate("layananId", "nama harga");

    if (!ticket) throw { status: 404, message: "Ticket tidak ditemukan" };

    // ================= DETAIL =================
    const detail = await DetailTicket.findOne({ ticketId: id });

    // ================= JADWAL =================
    const jadwal = await Jadwal.findOne({ ticketId: id });

    // ================= PAYMENTS =================
    const payments = await Payment.find({ ticketId: id }).sort({ createdAt: 1 });

    // ================= PAYMENT SUMMARY =================
    let totalHarga = 0;
    let totalDibayar = 0;

    if (ticket.layananId) {
      totalHarga = ticket.layananId.harga;
    }

    payments.forEach(p => {
      if (p.status === "approved") {
        totalDibayar += p.jumlah;
      }
    });

    const sisa = totalHarga - totalDibayar;

    let paymentStatus = "unpaid";

    if (totalDibayar > 0 && totalDibayar < totalHarga) {
      paymentStatus = "partial";
    }

    if (totalDibayar >= totalHarga) {
      paymentStatus = "paid";
    }

    const paymentSummary = {
      totalHarga,
      totalDibayar,
      sisa,
      status: paymentStatus
    };

    // ================= REVIEW =================
    const review = await Review.findOne({ ticketId: id });

    // ================= VOUCHER =================
    let voucher = null;
    if (review) {
      voucher = await Voucher.findOne({
        pelangganId: ticket.pelangganId._id
      }).sort({ createdAt: -1 });
    }

    // ================= CLAIM =================
    const claims = await CashbackClaim.find({
      pelangganId: ticket.pelangganId._id
    }).sort({ createdAt: -1 });

    // ================= LOG =================
    const logs = await LogActivity.find({
      ticketId: id
    }).sort({ createdAt: -1 });

    // ================= RESPONSE =================
    res.json({
      ticket,
      detail,
      jadwal,
      payments,
      paymentSummary,
      review,
      voucher,
      claims,
      logs
    });

  } catch (err) {
    next(err);
  }
};