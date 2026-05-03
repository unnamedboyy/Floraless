import Ticket from "../models/ticket.js";
import Pelanggan from "../models/pelanggan.js";
import CashbackClaim from "../models/cashbackClaim.js";
import Jadwal from "../models/jadwal.js";
import Payment from "../models/payment.js"; // 🔥 TAMBAH

export const getAdminDashboard = async (req, res, next) => {
  try {
    /* ================= BASIC ================= */

    const totalUser = await Pelanggan.countDocuments();
    const totalTicket = await Ticket.countDocuments();

    const pendingTicket = await Ticket.countDocuments({
      status: "pending",
    });

    const completedTicket = await Ticket.countDocuments({
      status: "done",
    });

    /* ================= PAYMENT ================= */

    const paymentPending = await Payment.countDocuments({
      status: "pending",
    });

    const totalRevenueAgg = await Payment.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: null, total: { $sum: "$jumlah" } } },
    ]);

    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    /* ================= CASHBACK ================= */

    const pendingCashback = await CashbackClaim.countDocuments({
      status: "pending",
    });

    const approvedCashback = await CashbackClaim.countDocuments({
      status: "approved",
    });

    /* ================= CHART REVENUE ================= */

    const revenueChartRaw = await Payment.aggregate([
      { $match: { status: "approved" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: "$jumlah" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const revenueChart = revenueChartRaw.map((r) => ({
      month: `${r._id.month}/${r._id.year}`,
      total: r.total,
    }));

    /* ================= TICKET STATUS ================= */

    const ticketStatusRaw = await Ticket.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const ticketStatus = {};
    ticketStatusRaw.forEach((t) => {
      ticketStatus[t._id] = t.count;
    });

    /* ================= RESPONSE ================= */

    res.json({
      totalUser,
      totalTicket,
      pendingTicket,
      completedTicket,

      paymentPending,
      totalRevenue,

      pendingCashback,
      approvedCashback,

      revenueChart,
      ticketStatus,
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