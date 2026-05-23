import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";

import {
  getPelanggan,
  createPelanggan,
  updatePelanggan,
  deletePelanggan,
} from "../controllers/pelanggan.controller.js";

const router = express.Router();

router.get("/", auth, role("admin"), getPelanggan);
router.post("/", auth, role("admin", "pelanggan"), createPelanggan);
router.put("/:id", auth, role("admin", "pelanggan"), updatePelanggan);

// 🔥 soft delete
router.patch("/:id/delete", auth, role("admin"), deletePelanggan);

export default router;