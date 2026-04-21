import express from "express";
import auth from "../middlewares/auth.js";

import { getLogsByTicket } from "../controllers/log.controller.js";

const router = express.Router();

router.get("/ticket/:ticketId", auth, getLogsByTicket);

export default router;