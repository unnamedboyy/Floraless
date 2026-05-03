import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";

import {
  createPayment,
  approvePayment,
  getPaymentsByTicket,
  getPaymentById,
  getPayments 
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/", auth, role("pelanggan"), createPayment);
router.patch("/:id/approve", auth, role("pegawai"), approvePayment);
router.get("/ticket/:ticketId", auth, getPaymentsByTicket);
router.get("/:id", auth, getPaymentById);
router.get("/", auth, getPayments);

export default router;