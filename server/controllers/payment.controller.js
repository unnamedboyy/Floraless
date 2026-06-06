import Payment
from "../models/payment.js";

import Ticket
from "../models/ticket.js";

import Layanan
from "../models/layanan.js";

import Pegawai
from "../models/pegawai.js";

import { logActivity }
from "../utils/logger.js";

import LogActivity from "../models/logAktivitas.js";


/* =========================================================
   CREATE PAYMENT (CUSTOMER)
========================================================= */

export const createPayment =
  async (
    req,
    res,
    next
  ) => {

    try {

      const {

        ticketId,
        tipe,
        nama_pengirim,
        bank_pengirim,

      } = req.body;

      /* ===================================================
         VALIDASI TICKET
      =================================================== */

      const ticket =
        await Ticket.findById(
          ticketId
        );

      if (!ticket) {

        throw {

          status: 404,

          message:
            "Ticket tidak ditemukan",
        };
      }

      if (
        ![
          "approved",
          "in_progress",
        ].includes(
          ticket.status
        )
      ) {

        throw {

          status: 400,

          message:
            "Ticket belum siap pembayaran",
        };
      }

      /* ===================================================
         VALIDASI LAYANAN
      =================================================== */

      const layanan =
        await Layanan.findById(
          ticket.layananId
        );

      if (!layanan) {

        throw {

          status: 404,

          message:
            "Layanan tidak ditemukan",
        };
      }

      /* ===================================================
         PAYMENT EXISTING
      =================================================== */

      const payments =
        await Payment.find({
          ticketId,
        });

      const approvedPayments =
        payments.filter(
          (p) =>
            p.status ===
            "approved"
        );

      const approvedTypes =
        approvedPayments.map(
          (p) => p.tipe
        );

      /* ===================================================
        SUDAH LUNAS SEKALI BAYAR
      =================================================== */

      if (
        approvedTypes.includes(
          "LUNAS"
        )
      ) {
        throw {
          status: 400,
          message:
            "Ticket sudah lunas",
        };
      }

      const pendingSameType =
        payments.find(
          (p) =>

            p.tipe === tipe &&

            p.status ===
              "pending"
        );

      if (
        pendingSameType
      ) {

        throw {

          status: 400,

          message:
            `${tipe} masih menunggu approval`,
        };
      }

      /* ===================================================
         VALIDASI FLOW
      =================================================== */

      if (

        tipe === "DP1" &&

        approvedTypes.includes(
          "DP1"
        )

      ) {

        throw {

          status: 400,

          message:
            "DP1 sudah dibayar",
        };
      }

      if (
        tipe === "DP2"
      ) {

        if (
          !approvedTypes.includes(
            "DP1"
          )
        ) {

          throw {

            status: 400,

            message:
              "DP1 belum di-approve",
          };
        }

        if (
          approvedTypes.includes(
            "DP2"
          )
        ) {

          throw {

            status: 400,

            message:
              "DP2 sudah dibayar",
          };
        }
      }

      if (
        tipe === "PELUNASAN"
      ) {

        if (

          !approvedTypes.includes(
            "DP1"
          ) ||

          !approvedTypes.includes(
            "DP2"
          )

        ) {

          throw {

            status: 400,

            message:
              "DP1 & DP2 harus approved dulu",
          };
        }

        if (
          approvedTypes.includes(
            "PELUNASAN"
          )
        ) {

          throw {

            status: 400,

            message:
              "Sudah lunas",
          };
        }
      }

      if (
        tipe === "LUNAS"
      ) {

        if (
          approvedTypes.length > 0
        ) {

          throw {
            status: 400,
            message:
              "Tidak bisa bayar lunas karena sudah ada pembayaran sebelumnya",
          };
        }

      }

      /* ===================================================
         HITUNG NOMINAL
      =================================================== */

      const harga =
        layanan.harga;

      let jumlah = 0;

      if (tipe === "DP1") {
        jumlah = harga * 0.2;
      }

      if (tipe === "DP2") {
        jumlah = harga * 0.3;
      }

      if (
        tipe ===
        "PELUNASAN"
      ) {

        jumlah = harga * 0.5;
      }

      if (
        tipe ===
        "LUNAS"
      ) {
        jumlah = harga;
      }

      /* ===================================================
         IMAGE
      =================================================== */

      let bukti_bayar =
        "";

      if (
        req.file?.filename
      ) {

        bukti_bayar =
          `/uploads/payment/${req.file.filename}`;
      }

      /* ===================================================
         CREATE
      =================================================== */

      const payment =
        await Payment.create({

          ticketId,

          tipe,

          jumlah,

          nama_pengirim,

          bank_pengirim,

          bukti_bayar,
        });

      /* ===================================================
         LOG
      =================================================== */

      await logActivity({

        userId:
          req.user.id,

        ticketId:
          ticket._id,

        action:
          "CREATE_PAYMENT",

        description:
          `Membuat pembayaran`,
      });

      res.json({

        message:
          "Payment berhasil dibuat",

        payment,
      });

    } catch (err) {

      next(err);
    }
  };

/* =========================================================
   REJECT PAYMENT
========================================================= */

export const rejectPayment =
  async (req, res, next) => {

    try {

      const { catatan } =
        req.body;

      const payment =
        await Payment.findById(
          req.params.id
        );

      if (!payment) {
        throw {
          status: 404,
          message: "Payment tidak ditemukan",
        };
      }

      payment.status =
        "rejected";

      payment.catatan =
        catatan.trim();

      await payment.save();

      /* ================= LOG ================= */

      await LogActivity.create({
        ticketId: payment.ticketId,
        action: "PAYMENT_REJECTED",
        status: "rejected",
        description: catatan,
      });

      /* ================= RESPONSE ================= */

      res.json({
        message:
          "Pembayaran berhasil ditolak",
      });

    } catch (err) {
      next(err);
    }
};


/* =========================================================
   APPROVE PAYMENT
========================================================= */

export const approvePayment =
  async (
    req,
    res,
    next
  ) => {

    try {

      const {
        status,
        catatan,
      } = req.body;

      if (
        ![
          "approved",
          "rejected",
        ].includes(status)
      ) {

        throw {

          status: 400,

          message:
            "Status tidak valid",
        };
      }

      const payment =
        await Payment.findById(
          req.params.id
        );

      if (!payment) {

        throw {

          status: 404,

          message:
            "Payment tidak ditemukan",
        };
      }

      if (
        payment.status !==
        "pending"
      ) {

        throw {

          status: 400,

          message:
            "Payment sudah diproses",
        };
      }

      const ticket =
        await Ticket.findById(
          payment.ticketId
        );

      /* ===================================================
        UPDATE
      =================================================== */

      payment.status =
        status;

      payment.approvedBy =
        req.user.id;

      payment.approvedAt =
        new Date();

      payment.catatan =
        catatan || "";

      await payment.save();

      /* ===================================================
         AUTO UPDATE TICKET
      =================================================== */

      if (
        status ===
        "approved"
      ) {

        const approvedPayments =
          await Payment.find({

            ticketId:
              payment.ticketId,

            status:
              "approved",
          });

        const types =
          approvedPayments.map(
            (p) => p.tipe
          );

        const isLunasBertahap =

          types.includes(
            "DP1"
          ) &&

          types.includes(
            "DP2"
          ) &&

          types.includes(
            "PELUNASAN"
          );

        const isLunasSekali =
          types.includes(
            "LUNAS"
          );

        if (
          isLunasBertahap ||
          isLunasSekali
        ) {

          ticket.status =
            "in_progress";

          await ticket.save();
        }
      }

      /* ===================================================
         LOG
      =================================================== */

      await logActivity({

        userId:
          req.user.id,

        ticketId:
          ticket._id,

        action:

          status ===
          "approved"

            ? "APPROVE_PAYMENT"

            : "REJECT_PAYMENT",

        description:
          `Payment ${payment.tipe} ${status}`,
      });

      res.json({

        message:
          `Payment ${status}`,

        payment,
      });

    } catch (err) {

      next(err);
    }
  };


/* =========================================================
   GET PAYMENT BY TICKET
========================================================= */

export const getPaymentsByTicket =
  async (
    req,
    res,
    next
  ) => {

    try {

      const data =
        await Payment.find({

          ticketId:
            req.params.ticketId,

        })

        .sort({
          createdAt: 1,
        });

      res.json(data);

    } catch (err) {

      next(err);
    }
  };

/* =========================================================
   GET PAYMENT BY ID
========================================================= */

export const getPaymentById =
  async (
    req,
    res,
    next
  ) => {

    try {

      const data =
        await Payment.findById(
          req.params.id
        );

      if (!data) {

        throw {

          status: 404,

          message:
            "Payment tidak ditemukan",
        };
      }

      res.json(data);

    } catch (err) {

      next(err);
    }
  };

/* =========================================================
   GET PAYMENTS
========================================================= */

export const getPayments =
  async (
    req,
    res,
    next
  ) => {

    try {

      const {

        page = 1,

        limit = 10,

        status,

      } = req.query;

      /* ===================================================
         FILTER
      =================================================== */

      let filter = {};

      if (status) {

        filter.status =
          status;
      }

      /* ===================================================
         FILTER PEGAWAI
      =================================================== */

      if (
        req.user.role ===
        "pegawai"
      ) {

        const pegawai =
          await Pegawai.findOne({

            userId:
              req.user.id,
          });

        if (!pegawai) {

          return res.status(404)
            .json({

              message:
                "Pegawai tidak ditemukan",
            });
        }

        /* ===================================================
           AMBIL TICKET PIC
        =================================================== */

        const tickets =
          await Ticket.find({

            pegawaiId:
              pegawai._id,
          }).select("_id");

        const ticketIds =
          tickets.map(
            (t) => t._id
          );

        /* ===================================================
           FILTER PAYMENT
        =================================================== */

        filter.ticketId = {
          $in: ticketIds,
        };
      }

      /* ===================================================
         QUERY PAYMENT
      =================================================== */

      const data =
        await Payment.find(
          filter
        )

        .populate({

          path: "ticketId",

          populate: [

            {

              path:
                "pelangganId",

              select:
                "nama no_telp",
            },

            {

              path:
                "layananId",

              select:
                "nama harga",
            },

            {

              path:
                "pegawaiId",

              select:
                "nama",
            },
          ],
        })

        .sort({
          createdAt: -1,
        })

        .skip(
          (Number(page) - 1) *
          Number(limit)
        )

        .limit(
          Number(limit)
        );

      /* ===================================================
         TOTAL
      =================================================== */

      const total =
        await Payment.countDocuments(
          filter
        );

      /* ===================================================
         RESPONSE
      =================================================== */

      return res.json({

        data,

        total,

        page:
          Number(page),

        totalPages:
          Math.ceil(
            total /
            Number(limit)
          ),
      });

    } catch (err) {

      next(err);
    }
  };