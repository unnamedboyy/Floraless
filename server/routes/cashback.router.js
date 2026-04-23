import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";

import {
  createClaim,
  processClaim,
  getMyClaims,
  getAllClaims
} from "../controllers/cashback.controller.js";

const router = express.Router();

// USER
router.post("/claim", auth, role("pelanggan"), createClaim);
router.get("/me", auth, role("pelanggan"), getMyClaims);

// ADMIN / PEGAWAI
router.get("/", auth, role("admin", "pegawai"), getAllClaims);
router.patch("/:id/process", auth, role("admin", "pegawai"), processClaim);

export default router;