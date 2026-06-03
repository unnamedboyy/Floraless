import express from "express";

import auth
from "../middlewares/auth.js";

import role
from "../middlewares/role.js";

import uploadPayment,
{
  processPaymentImage,
}
from "../middlewares/uploadPayment.js";

import {

  createPayment,
  approvePayment,
  rejectPayment,
  getPaymentsByTicket,
  getPaymentById,
  getPayments,

} from "../controllers/payment.controller.js";

const router =
  express.Router();

/* =========================================================
   CUSTOMER CREATE PAYMENT
========================================================= */

router.post(

  "/",
  auth,
  role("pelanggan"),
  uploadPayment.single(
    "bukti_bayar"
  ),
  processPaymentImage,
  createPayment
);

/* =========================================================
   APPROVE PAYMENT
========================================================= */

router.patch(
  "/:id/approve",
  auth,
  role("admin", "pegawai"),
  approvePayment
);

/* =========================================================
   REJECT PAYMENT
========================================================= */

router.patch(
  "/:id/reject",
  auth,
  role("admin", "pegawai"),
  rejectPayment
);

/* =========================================================
   GET PAYMENTS BY TICKET
========================================================= */

router.get(
  "/ticket/:ticketId",
  auth,
  getPaymentsByTicket
);

/* =========================================================
   GET PAYMENT DETAIL
========================================================= */

router.get(
  "/:id",
  auth,
  getPaymentById
);

/* =========================================================
   GET ALL PAYMENTS
========================================================= */

router.get(
  "/",
  auth,
  role("admin", "pegawai"),
  getPayments
);

export default router;