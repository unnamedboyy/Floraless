import express from "express";
import auth from "../middlewares/auth.js";

import { updateDetail } from "../controllers/detail.controller.js";

const router = express.Router();

router.patch("/:ticketId", auth, updateDetail);

export default router;