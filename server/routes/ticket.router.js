import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";

import {
  createTicket,
  getTickets,
  getTicketById,
  approveTicket,
  updateStatusTicket
} from "../controllers/ticket.controller.js";

const router = express.Router();

router.post("/", auth, role("pelanggan"), createTicket);
router.get("/", auth, getTickets);
router.get("/:id", auth, role("pelanggan"), getTicketById); 
router.patch("/:id/approve", auth, role("admin", "pegawai"), approveTicket);
router.patch("/:id/status",auth,role("admin", "pegawai"), updateStatusTicket);

export default router;