import Ticket from "../models/ticket.js";
import Pelanggan from "../models/pelanggan.js";
import CashbackClaim from "../models/cashbackClaim.js";
import Payment from "../models/payment.js";

export const getAdminDashboard = async (req, res, next) => {
  try {
    const { month, year } = req.query;

    /* ================= DATE FILTER ================= */

    let dateFilter = {};

    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);

      dateFilter = {
        createdAt: {
          $gte: start,
          $lt: end,
        },
      };
    }

    /* ================= BASIC ================= */

    const totalUser = await Pelanggan.countDocuments();

    const totalTicket = await Ticket.countDocuments(dateFilter);

    const pendingTicket = await Ticket.countDocuments({
      ...dateFilter,
      status: "pending",
    });

    const completedTicket = await Ticket.countDocuments({
      ...dateFilter,
      status: "done",
    });

    /* ================= PAYMENT ================= */

    const paymentPending = await Payment.countDocuments({
      ...dateFilter,
      status: "pending",
    });

    const totalRevenueAgg = await Payment.aggregate([
      { $match: { status: "approved", ...dateFilter } },
      { $group: { _id: null, total: { $sum: "$jumlah" } } },
    ]);

    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    /* ================= CASHBACK ================= */

    const pendingCashback = await CashbackClaim.countDocuments({
      ...dateFilter,
      status: "pending",
    });

    const approvedCashback = await CashbackClaim.countDocuments({
      ...dateFilter,
      status: "approved",
    });

    /* ================= CHART ================= */

    const revenueChartRaw = await Payment.aggregate([
      { $match: { status: "approved", ...dateFilter } },
      {
        $group: {
          _id: { day: { $dayOfMonth: "$createdAt" } },
          total: { $sum: "$jumlah" },
        },
      },
      { $sort: { "_id.day": 1 } },
    ]);

    const revenueChart = revenueChartRaw.map((r) => ({
      day: r._id.day,
      total: r.total,
    }));

    /* ================= STATUS ================= */

    const ticketStatusRaw = await Ticket.aggregate([
      { $match: dateFilter },
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