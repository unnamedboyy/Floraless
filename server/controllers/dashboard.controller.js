import Ticket from "../models/ticket.js";
import Pelanggan from "../models/pelanggan.js";
import CashbackClaim from "../models/cashbackClaim.js";
import Jadwal from "../models/jadwal.js";

export const getAdminDashboard = async (req, res, next) => {
  try {
    console.log("REQ USER:", req.user);
    const totalUser = await Pelanggan.countDocuments();
    const totalTicket = await Ticket.countDocuments();

    const pendingTicket = await Ticket.countDocuments({
      status: "pending",
    });

    const completedTicket = await Ticket.countDocuments({
      status: "done",
    });

    const pendingCashback = await CashbackClaim.countDocuments({
      status: "pending",
    });

    const approvedCashback = await CashbackClaim.countDocuments({
      status: "approved",
    });

    res.json({
      totalUser,
      totalTicket,
      pendingTicket,
      completedTicket,
      pendingCashback,
      approvedCashback,
    });
  } catch (err) {
    next(err);
  }
};

export const getPegawaiDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const assignedTicket = await Ticket.countDocuments({
      pegawaiId: userId,
    });

    const inProgress = await Ticket.countDocuments({
      pegawaiId: userId,
      status: "in_progress",
    });

    const completed = await Ticket.countDocuments({
      pegawaiId: userId,
      status: "done",
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySchedule = await Jadwal.countDocuments({
      pegawaiId: userId,
      tanggal_acara: today,
    });

    res.json({
      assignedTicket,
      inProgress,
      completed,
      todaySchedule,
    });
  } catch (err) {
    next(err);
  }
};