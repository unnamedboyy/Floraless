import express from "express";

import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";

import {
  getMyVouchers,
  getVoucherByCode,
  getAllVouchers,
  createVoucher,
  updateVoucher,
  deleteVoucher
} from "../controllers/voucher.controller.js";

const router = express.Router();

/* =====================================================
   PELANGGAN
===================================================== */

router.get(
  "/me",
  auth,
  role("pelanggan"),
  getMyVouchers
);

/* =====================================================
   GET BY CODE
===================================================== */

router.get(
  "/:code",
  auth,
  getVoucherByCode
);

/* =====================================================
   ADMIN
===================================================== */

router.get(
  "/",
  auth,
  role("admin"),
  getAllVouchers
);

/* ================= CREATE ================= */

router.post(
  "/",
  auth,
  role("admin"),
  createVoucher
);

/* ================= UPDATE ================= */

router.put(
  "/:id",
  auth,
  role("admin"),
  updateVoucher
);

/* ================= DELETE ================= */

router.delete(

  "/:id",
  auth,
  role("admin"),
  deleteVoucher
);

export default router;