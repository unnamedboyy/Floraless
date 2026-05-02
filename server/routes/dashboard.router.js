import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";

import {
  getAdminDashboard,
  getPegawaiDashboard,
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/admin", auth, role("admin"), getAdminDashboard);
router.get("/pegawai", auth, role("pegawai"), getPegawaiDashboard);

export default router;