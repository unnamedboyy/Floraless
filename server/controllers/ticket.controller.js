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
import Portfolio from "../models/portfolio.js";
import { getIO } from "../socket/index.js";
import { sendEmail } from "../utils/emailer.js";

/* =========================================================
   CUSTOMER CREATE TICKET
========================================================= */

export const createTicket = async (req, res, next) => {
  try {
    const {
      layananId,
      tanggal,
      lokasi,
      nama_acara,
      catatan,
      referensi,
    } = req.body;

    /* ================= CARI PELANGGAN ================= */

    const pelanggan = await Pelanggan.findOne({
      userId: req.user.id,
    });

    if (!pelanggan) {
      throw {
        status: 404,
        message: "Pelanggan tidak ditemukan",
      };
    }

    /* ================= VALIDASI INPUT ================= */

    if (!mongoose.Types.ObjectId.isValid(layananId)) {
      throw {
        status: 400,
        message: "Layanan tidak valid",
      };
    }

    const layanan = await Layanan.findById(layananId);

    if (!layanan) {
      throw {
        status: 404,
        message: "Layanan tidak ditemukan",
      };
    }

    if (!tanggal) {
      throw {
        status: 400,
        message: "Tanggal acara wajib diisi",
      };
    }

    if (!lokasi) {
      throw {
        status: 400,
        message: "Lokasi wajib diisi",
      };
    }

    if (!nama_acara) {
      throw {
        status: 400,
        message: "Nama acara wajib diisi",
      };
    }

    /* ================= CEK BENTROK ================= */

    const startDate = new Date(tanggal);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(tanggal);
    endDate.setHours(23, 59, 59, 999);

    const bentrok = await Jadwal.findOne({
      tanggal_acara: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    if (bentrok) {
      throw {
        status: 400,
        message: "Tanggal tersebut sudah dibooking pelanggan lain",
      };
    }

    /* ================= CREATE TICKET ================= */

    const ticket = await Ticket.create({
      pelangganId: pelanggan._id,
      layananId,
      status: "pending",
    });

    /* ================= CREATE DETAIL ================= */

    const detail = await DetailTicket.create({
      ticketId: ticket._id,
      tanggal_acara: tanggal,
      lokasi,
      nama_acara,
      catatan: catatan || "",
      referensi: referensi || "",
    });

    /* ================= CREATE JADWAL ================= */

    try {
      await Jadwal.create({
        ticketId: ticket._id,
        tanggal_acara: tanggal,
        status: "booked",
      });

      getIO().emit("jadwal:update");

    } catch (err) {
      if (err.code === 11000) {
        throw {
          status: 400,
          message: "Tanggal tersebut baru saja dibooking pelanggan lain",
        };
      }

      throw err;
    }

    /* ================= CREATE LOG ================= */
    await LogActivity.create({
      ticketId: ticket._id,
      action: "CREATE_TICKET",
      status: "pending",
      description: "Ticket dibuat oleh pelanggan",
    });

    /* ================= KIRIM EMAIL PELANGGAN ================= */

    await sendEmail({
      to: pelanggan.email,
      subject: "Ticket Anda Berhasil Dibuat",
      title: "Ticket Berhasil Dibuat",
      message: `Halo ${pelanggan.nama},

    Ticket Anda berhasil dibuat dan sedang menunggu persetujuan admin.

    Nomor Ticket: ${ticket._id}`,
      ctaText: "Lihat Ticket",
      ctaUrl: `${process.env.APP_URL}/ticket/${ticket._id}`,
    });


    /* ================= KIRIM EMAIL ADMIN ================= */
    const admins = await Admin.find().select("email");

    const adminEmails = admins
      .map((admin) => admin.email)
      .filter(Boolean);

    if (adminEmails.length) {
      await sendEmail({
        to: adminEmails,
        subject: `Pesanan ${payment.tipe} Menunggu Verifikasi`,
        title: "Pesanan Baru Masuk",
        message: `Halo Admin,

    Terdapat pesanan baru yang memerlukan verifikasi.

    Nomor Ticket: ${ticket._id},

    Silakan login ke dashboard admin untuk melakukan verifikasi pesanan.`,
        ctaText: "Verifikasi Pesanan",
        ctaUrl: `${process.env.APP_URL}/admin/ticket/${ticket._id}`,
      });
    }

    /* ================= RESPONSE ================= */

    return res.status(201).json({
      success: true,
      message: "Ticket berhasil dibuat",
      data: {
        ticket,
        detail,
      },
    });

  } catch (err) {
    console.error("CREATE TICKET ERROR:", err);

    return next({
      status: err.status || 500,
      message: err.message || "Gagal membuat ticket",
    });
  }
};

/* =========================================================
   ADMIN CREATE TICKET
========================================================= */

export const createTicketByAdmin = async (req, res, next) => {
  try {
    const {
      pelangganId,
      pegawaiId,
      layananId,
      tanggal,
      lokasi,
      nama_acara,
      catatan,
      referensi,
    } = req.body;

    /* ================= VALIDASI ================= */

    if (!pelangganId) {
      throw {
        status: 400,
        message: "Pelanggan wajib dipilih",
      };
    }

    if (!pegawaiId) {
      throw {
        status: 400,
        message: "Pegawai PIC wajib dipilih",
      };
    }

    const pelanggan =
      await Pelanggan.findById(pelangganId);

    if (!pelanggan) {
      throw {
        status: 404,
        message: "Pelanggan tidak ditemukan",
      };
    }

    const pegawai =
      await Pegawai.findById(pegawaiId);

    if (!pegawai) {
      throw {
        status: 404,
        message: "Pegawai tidak ditemukan",
      };
    }

    const layanan =
      await Layanan.findById(layananId);

    if (!layanan) {
      throw {
        status: 404,
        message: "Layanan tidak ditemukan",
      };
    }

    /* ================= CEK BENTROK ================= */

    const startDate = new Date(tanggal);
    startDate.setHours(0,0,0,0);

    const endDate = new Date(tanggal);
    endDate.setHours(23,59,59,999);

    const bentrok =
      await Jadwal.findOne({
        tanggal_acara: {
          $gte: startDate,
          $lte: endDate,
        },
      });

    if (bentrok) {
      throw {
        status: 400,
        message:
          "Tanggal tersebut sudah dibooking",
      };
    }

    /* ================= CREATE TICKET ================= */

    const ticket =
      await Ticket.create({

        pelangganId,

        pegawaiId,

        layananId,

        status:
          "approved",

      });

    /* ================= CREATE DETAIL ================= */

    await DetailTicket.create({

      ticketId:
        ticket._id,

      tanggal_acara:
        tanggal,

      lokasi,

      nama_acara,

      catatan:
        catatan || "",

      referensi:
        referensi || "",

    });

    /* ================= CREATE JADWAL ================= */

    await Jadwal.create({

      ticketId:
        ticket._id,

      pegawaiId,

      tanggal_acara:
        tanggal,

      status:
        "booked",

    });

    getIO().emit(
      "jadwal:update"
    );

    /* ================= LOG ================= */

    await LogActivity.create({

      ticketId:
        ticket._id,

      action:
        "CREATE_TICKET_ADMIN",

      status:
        "approved",

      description:
        "Ticket dibuat oleh admin",

    });

  /* ================= EMAIL ================= */

  await sendEmail({
    to: pelanggan.email,
    subject: "Pemesanan Anda Telah Dibuat",
    title: "Pemesanan Berhasil Dibuat",
    message: `Halo ${pelanggan.nama},

  Admin telah membuat pemesanan atas nama Anda dan pesanan tersebut telah langsung disetujui.

  Detail acara:
  • Layanan : ${layanan.nama}
  • Nama Acara : ${nama_acara}
  • Tanggal : ${new Date(tanggal).toLocaleDateString("id-ID")}
  • Lokasi : ${lokasi}

  Silakan login ke FLORALESS untuk melihat detail pemesanan dan proses selanjutnya.

  Nomor Ticket: ${ticket._id}`,
    ctaText: "Lihat Ticket",
    ctaUrl: `${process.env.APP_URL}/ticket/${ticket._id}`,
  });

  await sendEmail({
    to: pegawai.email,
    subject: "Penugasan Acara Baru",
    title: "Anda Mendapat Penugasan Baru",
    message: `Halo ${pegawai.nama},

  Anda telah ditugaskan sebagai PIC untuk acara berikut.

  Detail penugasan:
  • Nama Acara : ${nama_acara}
  • Layanan : ${layanan.nama}
  • Tanggal : ${new Date(tanggal).toLocaleDateString("id-ID")}
  • Lokasi : ${lokasi}

  Silakan login ke FLORALESS untuk melihat detail penugasan Anda.

  Nomor Ticket: ${ticket._id}`,
    ctaText: "Lihat Penugasan",
    ctaUrl: `${process.env.APP_URL}/pegawai/ticket/${ticket._id}`,
  });

    res.status(201).json({

      success: true,

      message:
        "Ticket berhasil dibuat",

      data: ticket,

    });

  } catch (err) {
    next(err);
  }
};

/* =========================================================
   GET ALL TICKET
========================================================= */

export const getTickets = async (req, res, next) => {
  try {

    const {
      page = 1,
      limit = 10,
      status,
      tanggal,
    } = req.query;

    let filter = {};

    /* ================= PELANGGAN ================= */

    if (req.user.role === "pelanggan") {

      const pelanggan =
        await Pelanggan.findOne({
          userId: req.user.id,
        });

      if (!pelanggan) {

        return res.status(404).json({
          message:
            "Pelanggan tidak ditemukan",
        });

      }

      filter.pelangganId =
        pelanggan._id;
    }

    /* ================= PEGAWAI ================= */

    if (req.user.role === "pegawai") {

      const pegawai =
        await Pegawai.findOne({
          userId: req.user.id,
        });

      if (!pegawai) {

        return res.status(404).json({
          message:
            "Pegawai tidak ditemukan",
        });

      }

      filter.pegawaiId =
        pegawai._id;
    }

    /* ================= FILTER STATUS ================= */

    if (status) {

      filter.status = status;

    }

    const skip =
      (page - 1) * limit;

    let tickets =
      await Ticket.find(filter)
        .populate(
          "pelangganId",
          "nama no_telp"
        )
        .populate(
          "layananId",
          "nama harga"
        )
        .populate(
          "pegawaiId",
          "nama"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(Number(limit));

    /* ================= FILTER TANGGAL ================= */

    if (tanggal) {

      const jadwals =
        await Jadwal.find({
          tanggal_acara:
            new Date(tanggal),
        });

      const ticketIds =
        jadwals.map(
          (j) =>
            j.ticketId.toString()
        );

      tickets =
        tickets.filter((t) =>
          ticketIds.includes(
            t._id.toString()
          )
        );
    }

    /* ================= DETAIL TICKET ================= */

    const ticketIds =
      tickets.map(
        (ticket) =>
          ticket._id
      );

    const details =
      await DetailTicket.find({
        ticketId: {
          $in: ticketIds,
        },
      });

    const detailMap =
      new Map(
        details.map(
          (detail) => [
            detail.ticketId.toString(),
            detail,
          ]
        )
      );

    const ticketsWithDetail =
      tickets.map((ticket) => ({

        ...ticket.toObject(),

        detail:
          detailMap.get(
            ticket._id.toString()
          ) || null,

      }));

    /* ================= TOTAL ================= */

    const total =
      await Ticket.countDocuments(
        filter
      );

    res.json({

      data:
        ticketsWithDetail,

      total,

      page:
        Number(page),

      totalPages:
        Math.ceil(
          total / limit
        ),

    });

  } catch (err) {

    next(err);

  }
};

/* =========================================================
   GET TICKET BY ID
========================================================= */

export const getTicketById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id)
      .populate("pelangganId", "nama no_telp")
      .populate("layananId", "nama harga")
      .populate("pegawaiId", "nama");

    if (!ticket) {
      throw {
        status: 404,
        message: "Ticket tidak ditemukan",
      };
    }

    /* ================= VALIDASI OWNERSHIP ================= */

    if (req.user.role === "pelanggan") {
      const pelanggan = await Pelanggan.findOne({
        userId: req.user.id,
      });

      if (
        !pelanggan ||
        ticket.pelangganId._id.toString() !== pelanggan._id.toString()
      ) {
        throw {
          status: 403,
          message: "Tidak memiliki akses",
        };
      }
    }

    const summary = await getPaymentSummary(ticket);

    const detail = await DetailTicket.findOne({
      ticketId: id,
    });

    const jadwal = await Jadwal.findOne({
      ticketId: id,
    });

    const logs = await LogActivity.find({
      ticketId: id,
    }).sort({ createdAt: 1 });

    res.json({
      ticket,
      detail,
      jadwal,
      logs,
      summary,
    });

  } catch (err) {
    next(err);
  }
};

/* =========================================================
   APPROVE TICKET
========================================================= */

export const approveTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { pegawaiId } = req.body;

    if (!pegawaiId) {
      return res.status(400).json({
        message: "pegawaiId wajib diisi",
      });
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
      .populate("pelangganId", "nama email")
      .populate("layananId", "nama harga");

    if (!updated) {
      return res.status(404).json({
        message: "Ticket tidak ditemukan",
      });
    }

    await LogActivity.create({
      ticketId: updated._id,
      action: "APPROVE_TICKET",
      status: "approved",
      description: "Ticket disetujui",
    });

    await sendEmail({
      to: updated.pelangganId?.email,
      subject: "Ticket Anda Disetujui",
      title: "Ticket Disetujui ✅",
      message: `Halo ${updated.pelangganId?.nama || ""},\n\nTicket Anda telah disetujui dan ditangani oleh ${updated.pegawaiId?.nama || "tim kami"}.`,
      ctaText: "Lihat Detail Ticket",
      ctaUrl: `${process.env.APP_URL}/ticket/${updated._id}`,
    });

    res.json(updated);

  } catch (err) {
    console.error("APPROVE ERROR:", err);
    next(err);
  }
};

/* =========================================================
   UPDATE STATUS
========================================================= */

export const updateStatusTicket = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const { id } = req.params;
    const allowedStatus = ["pending","approved","in_progress","done","rejected"];

    if (!allowedStatus.includes(status)) {
      throw {status: 400, message: "Status tidak valid"};
    }

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw {status: 404,message: "Ticket tidak ditemukan"};
    }

    const flow = {pending: ["approved", "rejected"], approved: ["in_progress"], in_progress: ["done"], done: [], rejected: []};
    const current = ticket.status;

    if (!flow[current].includes(status)) {
      throw {status: 400, message: `Tidak bisa mengubah status dari ${current} ke ${status}`};
    }

    ticket.status = status;

    /* ================= HAPUS JADWAL JIKA REJECT ================= */
    if (status === "rejected") {
      await Jadwal.deleteOne({
        ticketId: ticket._id,
      });

      getIO().emit("jadwal:update");
    }

    await ticket.save();
    await LogActivity.create({
      ticketId: ticket._id,
      action: "UPDATE_STATUS",
      status,
      description:
        status === "rejected"
          ? `Ticket ditolak. Alasan: ${note || "-"}`
          : `Status diubah ke ${status}`,
    });

    /* ================= KIRIM EMAIL NOTIFIKASI STATUS ================= */

    const pelangganTicket = await Pelanggan.findById(ticket.pelangganId);

    if (pelangganTicket?.email) {
      const emailMap = {
        rejected: {
          subject: "Ticket Anda Ditolak",
          title: "Ticket Ditolak",
          message: `Halo ${pelangganTicket.nama || ""},\n\nMohon maaf, ticket Anda ditolak.\nAlasan: ${note || "-"}`,
        },
        done: {
          subject: "🎉 Acara Selesai! Terima Kasih Telah Memilih FLORALESS",
          title: "Acara Anda Telah Selesai",
          message: `Halo ${pelangganTicket.nama || ""},

        Terima kasih telah mempercayakan kebutuhan dekorasi Anda kepada FLORALESS.
        Kami dengan senang hati menginformasikan bahwa seluruh rangkaian layanan untuk pesanan Anda telah selesai.
        Kami sangat menghargai pengalaman Anda selama menggunakan layanan kami. Oleh karena itu, kami mengundang Anda untuk memberikan ulasan dan penilaian terhadap layanan FLORALESS.
        Sebagai bentuk apresiasi, setiap pelanggan yang memberikan review akan mendapatkan voucher cashback yang dapat digunakan dengan masa beraku 30 hari.
        Terima kasih atas kepercayaan Anda. Kami berharap dapat kembali melayani Anda di kesempatan berikutnya.`,
        },
        in_progress: {
          subject: "Ticket Sedang Dikerjakan",
          title: "Ticket Diproses",
          message: `Halo ${pelangganTicket.nama || ""},\n\nTicket Anda sedang dalam proses pengerjaan.`,
        },
      };

      const tpl = emailMap[status];

      if (tpl) {
        await sendEmail({
          to: pelangganTicket.email,
          subject: tpl.subject,
          title: tpl.title,
          message: tpl.message,
          ctaText: "Lihat Ticket",
          ctaUrl: `${process.env.APP_URL}/ticket/${ticket._id}`,
        });
      }
    }

  } catch (err) {
    next(err);
  }
};

/* =========================================================
   PAYMENT SUMMARY
========================================================= */

const getPaymentSummary = async (ticket) => {

  const layanan = await Layanan.findById(ticket.layananId);

  if (!layanan) {
    throw {
      status: 404,
      message: "Layanan tidak ditemukan",
    };
  }

  const totalTagihan = layanan.harga;

  const payments = await Payment.find({
    ticketId: ticket._id,
    status: "approved",
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
    jumlahPembayaran: payments.length,
  };
};

/* =========================================================
   PAYMENT SUMMARY BY TICKET
========================================================= */

export const getPaymentSummaryByTicket = async (req, res, next) => {
  try {

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw {
        status: 404,
        message: "Ticket tidak ditemukan",
      };
    }

    const summary = await getPaymentSummary(ticket);

    res.json(summary);

  } catch (err) {
    next(err);
  }
};

/* =========================================================
   FULL DETAIL TICKET
========================================================= */

export const getTicketFullById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id)
      .populate("pelangganId", "nama no_telp")
      .populate("pegawaiId", "nama")
      .populate("layananId", "nama harga");

    if (!ticket) {
      throw {
        status: 404,
        message: "Ticket tidak ditemukan",
      };
    }

    /* ================= VALIDASI OWNERSHIP ================= */

    if (req.user.role === "pelanggan") {
      const pelanggan = await Pelanggan.findOne({
        userId: req.user.id,
      });

      if (
        !pelanggan ||
        ticket.pelangganId._id.toString() !== pelanggan._id.toString()
      ) {
        throw {
          status: 403,
          message: "Tidak memiliki akses",
        };
      }
    }

    const detail = await DetailTicket.findOne({
      ticketId: id,
    });

    const jadwal = await Jadwal.findOne({
      ticketId: id,
    });

    const payments = await Payment.find({
      ticketId: id,
    }).sort({ createdAt: 1 });

    let totalHarga = 0;
    let totalDibayar = 0;

    if (ticket.layananId) {
      totalHarga = ticket.layananId.harga;
    }

    payments.forEach((p) => {
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
      status: paymentStatus,
    };

    const review = await Review.findOne({
      ticketId: id,
    });

    const claims = await CashbackClaim.find({
      pelangganId: ticket.pelangganId._id,
    }).sort({ createdAt: -1 });

    const logs = await LogActivity.find({
      ticketId: id,
    }).sort({ createdAt: -1 });

    const portfolio = await Portfolio.findOne({
      ticketId: ticket._id,
      isActive: true,
    });

    res.json({
      ticket,
      detail,
      jadwal,
      payments,
      paymentSummary,
      review,
      claims,
      logs,
      portfolioExists: !!portfolio,
      portfolio,
    });

  } catch (err) {
    next(err);
  }
};


export const addTicketLog =
  async (req, res, next) => {
    try {

      const { id } =
        req.params;

      const {
        description,
      } = req.body;

      const ticket =
        await Ticket.findById(id);

      if (!ticket) {
        return res.status(404).json({
          message:
            "Ticket tidak ditemukan",
        });
      }

      const log =
        await LogActivity.create({

          userId:
            req.user.id,

          ticketId:
            ticket._id,

          action:
            "UPDATE_PROGRESS",

          description,
        });

      getIO().emit(
        "ticketUpdated"
      );

      return res.status(201).json({

        success: true,

        message:
          "Log aktivitas berhasil ditambahkan",

        data: log,
      });

    } catch (err) {
      next(err);
    }
  };