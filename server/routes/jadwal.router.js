import express from "express";
import auth from "../middlewares/auth.js";

import {
  createJadwal,
  updateJadwal,
  deleteJadwal,
  getJadwal
} from "../controllers/jadwal.controller.js";

const router = express.Router();

router.get("/", auth, getJadwal);
router.post("/", auth, createJadwal);
router.put("/:id", auth, updateJadwal);
router.delete("/:id", auth, deleteJadwal);

export default router;