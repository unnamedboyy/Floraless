import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";

import {
  createReview,
  getReviewByTicket
} from "../controllers/review.controller.js";

const router = express.Router();

router.post("/", auth, role("pelanggan"), createReview);
router.get("/ticket/:ticketId", auth, getReviewByTicket);

export default router;