import puppeteer
from "puppeteer";

import Ticket
from "../models/ticket.js";

import Payment
from "../models/payment.js";

import DetailTicket
from "../models/detailTicket.js";

import invoiceTemplate
from "../pdf/invoice/invoice.template.js";

import financialTemplate
from "../pdf/financial/financial.template.js";

import {

    invoiceNumber,
    periodLabel
} from "../pdf/shared/helpers.js";

import fs from "fs";
import path from "path";

/* =====================================================
   EXPORT INVOICE
===================================================== */

export const exportInvoice =
  async (
    req,
    res,
    next
  ) => {

    try {

      const {
        ticketId,
      } = req.params;

      /* =====================================================
         TICKET
      ===================================================== */

      const ticket =
        await Ticket.findById(
          ticketId
        )

        .populate(
          "pelangganId"
        )

        .populate(
          "layananId"
        )

        .populate(
          "pegawaiId"
        );

      if (!ticket) {

        return res.status(404)
          .json({

            message:
              "Ticket tidak ditemukan",
          });
      }

      /* =====================================================
         DETAIL
      ===================================================== */

      const detail =
        await DetailTicket.findOne({

          ticketId:
            ticket._id,
        });

      /* =====================================================
         PAYMENTS
      ===================================================== */

      const payments =
        await Payment.find({

          ticketId:
            ticket._id,

          status:
            "approved",
        })

        .sort({
          createdAt: 1,
        });

      /* =====================================================
         TOTAL HARGA
      ===================================================== */

      const totalHarga =
        ticket
          .layananId
          ?.harga || 0;

      /* =====================================================
         PAYMENT PLAN
      ===================================================== */

      const paymentPlan = [

        {
          tipe: "DP1",
          percentage: 30,
        },

        {
          tipe: "DP2",
          percentage: 30,
        },

        {
          tipe: "Pelunasan",
          percentage: 40,
        },
      ];

      /* =====================================================
         PAYMENT ROWS
      ===================================================== */

      const paymentRows =
        paymentPlan.map((plan) => {

          const paid =
            payments.find(

              (p) =>
                p.tipe ===
                plan.tipe
            );

          const targetNominal =
            Math.round(
              (
                totalHarga *
                plan.percentage
              ) / 100
            );

          return {

            tipe:
              plan.tipe,

            paid:
              !!paid,

            tanggal:
              paid?.createdAt || null,

            jumlah:
              paid?.jumlah ||
              targetNominal,

            pengirim:
              paid?.nama_pengirim || "-",
          };
        });

      /* =====================================================
         SUMMARY
      ===================================================== */

      const totalPaid =
        payments.reduce(

          (acc, item) =>

            acc +
            item.jumlah,

          0
        );

      const remaining =
        totalHarga -
        totalPaid;

      /* =====================================================
         INVOICE NUMBER
      ===================================================== */

      const invoiceNo =
        invoiceNumber(
          ticket._id
        );

        /* =====================================================
        LOGO BASE64
        ===================================================== */

        const logoPath =
        path.join(
            process.cwd(),
            "public",
            "logo.png"
        );

        const logoBase64 =
        fs.readFileSync(
            logoPath,
            {
            encoding: "base64",
            }
        );

        const logo =
        `data:image/png;base64,${logoBase64}`;

      /* =====================================================
         HTML
      ===================================================== */

      const html =
        invoiceTemplate({

          ticket,

          detail,

          payments,

          paymentRows,

          totalHarga,

          totalPaid,

          remaining,

          invoiceNo,

          logo,
        });

      /* =====================================================
         PUPPETEER
      ===================================================== */

      const browser =
        await puppeteer.launch({

          headless: true,
        });

      const page =
        await browser.newPage();

      await page.setContent(
        html,
        {

          waitUntil:
            "domcontentloaded",
        }
      );

      const pdf =
        await page.pdf({

          format: "A4",

          printBackground: true,

          margin: {

            top: "20px",

            right: "20px",

            bottom: "20px",

            left: "20px",
          },
        });

      await browser.close();

      /* =====================================================
         RESPONSE
      ===================================================== */

      res.set({

        "Content-Type":
          "application/pdf",

        "Content-Disposition":
          `inline; filename=${invoiceNo}.pdf`,
      });

      return res.send(pdf);

    } catch (err) {

      next(err);
    }
  };

  /* =====================================================
   GET FINANCIAL REPORT
===================================================== */

export const getFinancialReport =
  async (
    req,
    res,
    next
  ) => {

    try {

      const {

        type,

        year,

        month,

        startDate,

        endDate,

      } = req.query;

      let filter = {};

      /* =====================================================
         FILTER DATE
      ===================================================== */

      if (
        type === "yearly" &&
        year
      ) {

        filter.createdAt = {

          $gte:
            new Date(
              `${year}-01-01`
            ),

          $lte:
            new Date(
              `${year}-12-31`
            ),
        };
      }

      if (
        type === "monthly" &&
        year &&
        month
      ) {

        const start =
          new Date(
            year,
            month - 1,
            1
          );

        const end =
          new Date(
            year,
            month,
            0,
            23,
            59,
            59
          );

        filter.createdAt = {

          $gte: start,

          $lte: end,
        };
      }

      if (
        type === "range" &&
        startDate &&
        endDate
      ) {

        filter.createdAt = {

          $gte:
            new Date(
              startDate
            ),

          $lte:
            new Date(
              endDate
            ),
        };
      }

      /* =====================================================
         QUERY
      ===================================================== */

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
                "nama",
            },

            {
              path:
                "layananId",

              select:
                "nama",
            },
          ],
        })

        .sort({
          createdAt: -1,
        });

      /* =====================================================
         SUMMARY
      ===================================================== */

      const summary = {

        totalTransaction:
          data.length,

        totalIncome:
          data

          .filter(
            (i) =>
              i.status ===
              "approved"
          )

          .reduce(

            (
              acc,
              item
            ) =>

              acc +
              item.jumlah,

            0
          ),

        approved:
          data.filter(
            (i) =>
              i.status ===
              "approved"
          ).length,

        pending:
          data.filter(
            (i) =>
              i.status ===
              "pending"
          ).length,
      };

      res.json({

        data,

        summary,
      });

    } catch (err) {

      next(err);
    }
  };

/* =====================================================
   EXPORT FINANCIAL PDF
===================================================== */

export const exportFinancialReport =
  async (
    req,
    res,
    next
  ) => {

    try {

      const {

        type,

        year,

        month,

        startDate,

        endDate,

      } = req.query;

      let filter = {};

      /* =====================================================
         FILTER
      ===================================================== */

      if (
        type === "yearly" &&
        year
      ) {

        filter.createdAt = {

          $gte:
            new Date(
              `${year}-01-01`
            ),

          $lte:
            new Date(
              `${year}-12-31`
            ),
        };
      }

      if (
        type === "monthly" &&
        year &&
        month
      ) {

        const start =
          new Date(
            year,
            month - 1,
            1
          );

        const end =
          new Date(
            year,
            month,
            0,
            23,
            59,
            59
          );

        filter.createdAt = {

          $gte: start,

          $lte: end,
        };
      }

      if (
        type === "range" &&
        startDate &&
        endDate
      ) {

        filter.createdAt = {

          $gte:
            new Date(
              startDate
            ),

          $lte:
            new Date(
              endDate
            ),
        };
      }

      /* =====================================================
         QUERY
      ===================================================== */

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
                "nama",
            },

            {
              path:
                "layananId",

              select:
                "nama",
            },
          ],
        })

        .sort({
          createdAt: -1,
        });

      /* =====================================================
         SUMMARY
      ===================================================== */

      const summary = {

        totalTransaction:
          data.length,

        totalIncome:
          data

          .filter(
            (i) =>
              i.status ===
              "approved"
          )

          .reduce(

            (
              acc,
              item
            ) =>

              acc +
              item.jumlah,

            0
          ),

        approved:
          data.filter(
            (i) =>
              i.status ===
              "approved"
          ).length,

        pending:
          data.filter(
            (i) =>
              i.status ===
              "pending"
          ).length,
      };

      /* =====================================================
         LOGO
      ===================================================== */

      const logoPath =
        path.join(
          process.cwd(),
          "public",
          "logo.png"
        );

      const logoBase64 =
        fs.readFileSync(
          logoPath,
          {
            encoding:
              "base64",
          }
        );

      const logo =
        `data:image/png;base64,${logoBase64}`;

      /* =====================================================
         HTML
      ===================================================== */

      const html =
        financialTemplate({

          logo,

          data,

          summary,

          periodLabel:
            periodLabel({

              type,

              year,

              month,

              startDate,

              endDate,
            }),
        });

      /* =====================================================
         PDF
      ===================================================== */

      const browser =
        await puppeteer.launch({

          headless: true,
        });

      const page =
        await browser.newPage();

      await page.setContent(
        html,
        {

          waitUntil:
            "domcontentloaded",
        }
      );

      const pdf =
        await page.pdf({

          format: "A4",

          printBackground: true,

          margin: {

            top: "20px",

            right: "20px",

            bottom: "20px",

            left: "20px",
          },
        });

      await browser.close();

      /* =====================================================
         RESPONSE
      ===================================================== */

      res.set({

        "Content-Type":
          "application/pdf",

        "Content-Disposition":
          `inline; filename=financial-report.pdf`,
      });

      return res.send(pdf);

    } catch (err) {

      next(err);
    }
  };