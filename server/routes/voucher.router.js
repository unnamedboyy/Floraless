import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";

import {
  getMyVouchers,
  getVoucherByCode,
  getAllVouchers
} from "../controllers/voucher.controller.js";

const router = express.Router();

router.get("/me", auth, role("pelanggan"), getMyVouchers);
router.get("/:code", auth, getVoucherByCode);
router.get("/", auth, role("admin"), getAllVouchers);

export default router;