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

router.get("/me", auth, role("pelanggan"), getMyVouchers);
router.get("/:code", auth, getVoucherByCode);
router.get("/", auth, role("admin"), getAllVouchers);
router.post("/", auth, role("admin"), createVoucher);
router.put("/:id", auth, role("admin"), updateVoucher);
router.delete("/:id", auth, role("admin"), deleteVoucher);

export default router;