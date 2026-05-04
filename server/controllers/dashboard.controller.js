import Ticket from "../models/ticket.js";
import Payment from "../models/payment.js";
import Cashback from "../models/cashbackClaim.js";
import Jadwal from "../models/jadwal.js";
import Pegawai from "../models/pegawai.js";

/* ================= ADMIN DASHBOARD ================= */

export const getAdminDashboard = async (req, res) => {
  try {
    const { month, year } = req.query;

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

    /* ================= SUMMARY ================= */

    const totalTicket = await Ticket.countDocuments(dateFilter);

    const pendingTicket = await Ticket.countDocuments({
      ...dateFilter,
      status: "pending",
    });

    const paymentPending = await Payment.countDocuments({
      status: "pending",
    });

    const pendingCashback = await Cashback.countDocuments({
      status: "pending",
    });

    /* ================= REVENUE ================= */

    const payments = await Payment.find({
      status: "approved",
      ...dateFilter,
    });

    const totalRevenue = payments.reduce(
      (sum, p) => sum + p.jumlah,
      0
    );

    /* ================= CHART (PER DAY) ================= */

    const revenueMap = {};

    payments.forEach((p) => {
      const day = new Date(p.createdAt).getDate();

      if (!revenueMap[day]) revenueMap[day] = 0;
      revenueMap[day] += p.jumlah;
    });

    const revenueChart = Object.keys(revenueMap).map((day) => ({
      day,
      total: revenueMap[day],
    }));

    /* ================= STATUS ================= */

    const ticketStatus = {
      pending: await Ticket.countDocuments({ status: "pending" }),
      approved: await Ticket.countDocuments({ status: "approved" }),
      in_progress: await Ticket.countDocuments({ status: "in_progress" }),
      done: await Ticket.countDocuments({ status: "done" }),
    };

    return res.json({
      totalTicket,
      pendingTicket,
      paymentPending,
      pendingCashback,
      totalRevenue,
      revenueChart,
      ticketStatus,
    });

  } catch (err) {
    console.error("ADMIN DASHBOARD ERROR:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

/* ================= PEGAWAI DASHBOARD ================= */

export const getPegawaiDashboard = async (req, res) => {
  try {
    console.log("USER:", req.user);

    if (!req.user?.id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    /* ================= AMBIL DATA PEGAWAI ================= */

    const pegawai = await Pegawai.findOne({
      userId: req.user.id,
    });

    console.log("PEGAWAI:", pegawai);

    if (!pegawai) {
      return res.status(404).json({
        message: "Pegawai tidak ditemukan",
      });
    }

    /* ================= SUMMARY ================= */

    const assigned = await Ticket.countDocuments({
      pegawaiId: pegawai._id,
    });

    const inProgress = await Ticket.countDocuments({
      pegawaiId: pegawai._id,
      status: "in_progress",
    });

    const completed = await Ticket.countDocuments({
      pegawaiId: pegawai._id,
      status: "done",
    });

    /* ================= TODAY SCHEDULE ================= */

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todaySchedule = await Jadwal.countDocuments({
      pegawaiId: pegawai._id,
      tanggal_acara: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    return res.json({
      assigned,
      inProgress,
      completed,
      todaySchedule,
    });

  } catch (err) {
    console.error("DASHBOARD PEGAWAI ERROR:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};