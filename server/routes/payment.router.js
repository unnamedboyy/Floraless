import express from "express";
import auth from "../middlewares/auth.js";

import {
  createPayment,
  getPaymentsByTicket,
  getPaymentById
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/", auth, createPayment);
router.get("/ticket/:ticketId", auth, getPaymentsByTicket);
router.get("/:id", auth, getPaymentById);

export default router;