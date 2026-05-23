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
   APPROVE / REJECT
========================================================= */

router.patch(

  "/:id/approve",

  auth,

  role("pegawai"),

  approvePayment
);

/* =========================================================
   GET BY TICKET
========================================================= */

router.get(

  "/ticket/:ticketId",

  auth,

  getPaymentsByTicket
);

/* =========================================================
   GET DETAIL
========================================================= */

router.get(

  "/:id",

  auth,

  getPaymentById
);

/* =========================================================
   LIST
========================================================= */

router.get(

  "/",

  auth,

  getPayments
);

export default router;