import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";
import {
  createOrder,
  getOrders,
  getOrderById,
  approveOrder
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", auth, role("pelanggan"), createOrder);
router.get("/", auth, role("admin", "pegawai"), getOrders);
router.get("/:id", auth, getOrderById);
router.patch("/:id/approve", auth, role("admin", "pegawai"), approveOrder);

export default router;