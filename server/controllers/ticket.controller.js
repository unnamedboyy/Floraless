import mongoose from "mongoose";
import Ticket from "../models/ticket.js";
import DetailTicket from "../models/detailTicket.js";
import Jadwal from "../models/jadwal.js";
import HistoryStatus from "../models/historyStatus.js";
import Pelanggan from "../models/pelanggan.js";
import Layanan from "../models/layanan.js";
import Pegawai from "../models/pegawai.js";

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
    await HistoryStatus.create({
      ticketId: ticket._id,
      status: "pending",
      keterangan: "Ticket dibuat"
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

    const detail = await DetailTicket.findOne({ ticketId: id });
    const jadwal = await Jadwal.findOne({ ticketId: id });
    const history = await HistoryStatus.find({ ticketId: id }).sort({ createdAt: 1 });

    res.json({
      ticket,
      detail,
      jadwal,
      history
    });

  } catch (err) {
    next(err);
  }
};

// APPROVE (ASSIGN PIC)
export const approveTicket = async (req, res, next) => {
  try {
    const { pegawaiId } = req.body;

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) throw { status: 404, message: "Ticket tidak ditemukan" };

    if (ticket.status !== "pending") {
      throw { status: 400, message: "Ticket sudah diproses" };
    }

    const pegawai = await Pegawai.findById(pegawaiId);
    if (!pegawai) throw { status: 404, message: "Pegawai tidak ditemukan" };

    ticket.pegawaiId = pegawaiId;
    ticket.status = "approved";

    await ticket.save();

    await HistoryStatus.create({
      ticketId: ticket._id,
      status: "approved",
      keterangan: "Ticket disetujui & PIC ditentukan"
    });

    res.json(ticket);

  } catch (err) {
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
    await HistoryStatus.create({
      ticketId: ticket._id,
      status,
      keterangan: `Status diubah ke ${status}`
    });

    res.json({
      message: "Status berhasil diupdate",
      ticket
    });

  } catch (err) {
    next(err);
  }
};