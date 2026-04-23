import express from "express";
import auth from "../middlewares/auth.js";

import { updateJadwal } from "../controllers/jadwal.controller.js";

const router = express.Router();

router.patch("/:ticketId", auth, updateJadwal);

export default router;