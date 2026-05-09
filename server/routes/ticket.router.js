import express from "express";

import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";

import {
  createTicket,
  getTickets,
  getTicketById,
  approveTicket,
  updateStatusTicket,
  getPaymentSummaryByTicket,
  getTicketFullById,
} from "../controllers/ticket.controller.js";

const router = express.Router();

/* =========================================================
   CUSTOMER CREATE TICKET
========================================================= */

router.post(
  "/",
  auth,
  role("pelanggan"),
  createTicket
);

/* =========================================================
   GET ALL
========================================================= */

router.get(
  "/",
  auth,
  getTickets
);

/* =========================================================
   GET DETAIL
========================================================= */

router.get(
  "/:id",
  auth,
  getTicketById
);

router.get(
  "/:id/full",
  auth,
  getTicketFullById
);

/* =========================================================
   PAYMENT SUMMARY
========================================================= */

router.get(
  "/:id/paymentSummary",
  auth,
  getPaymentSummaryByTicket
);

/* =========================================================
   APPROVE
========================================================= */

router.patch(
  "/:id/approve",
  auth,
  role("admin", "pegawai"),
  approveTicket
);

/* =========================================================
   UPDATE STATUS
========================================================= */

router.patch(
  "/:id/status",
  auth,
  role("admin", "pegawai"),
  updateStatusTicket
);

export default router;