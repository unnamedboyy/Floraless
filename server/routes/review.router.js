import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";

import {
  createReview,
  getReviewByTicket,
  getAllReviews,
  toggleReviewStatus,
  deleteReview
} from "../controllers/review.controller.js";

const router = express.Router();

router.post("/", auth, role("pelanggan"), createReview);
router.get("/ticket/:ticketId", auth, getReviewByTicket);

router.get("/", auth, role("admin"), getAllReviews);
router.patch("/:id/toggle", auth, role("admin"), toggleReviewStatus);
router.delete("/:id", auth, role("admin"), deleteReview);

export default router;