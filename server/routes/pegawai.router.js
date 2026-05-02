import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";

import {
  getPegawai,
  createPegawai,
  updatePegawai,
  deletePegawai,
} from "../controllers/pegawai.controller.js";

const router = express.Router();

router.get("/", auth, role("admin"), getPegawai);
router.post("/", auth, role("admin"), createPegawai);
router.put("/:id", auth, role("admin"), updatePegawai);
router.delete("/:id", auth, role("admin"), deletePegawai);

export default router;