import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";

import {
  createReview,
  getReviewByTicket,
  getAllReviews,
  getPublicReviews,
  toggleReviewStatus,
  deleteReview
} from "../controllers/review.controller.js";

const router = express.Router();

/* ================= PUBLIC ================= */

router.get("/public", getPublicReviews);

/* ================= PELANGGAN ================= */

router.post("/", auth, role("pelanggan"), createReview);

router.get(
  "/ticket/:ticketId",
  auth,
  getReviewByTicket
);

/* ================= ADMIN ================= */

router.get(
  "/",
  auth,
  role("admin"),
  getAllReviews
);

router.patch(
  "/:id/toggle",
  auth,
  role("admin"),
  toggleReviewStatus
);

router.delete(
  "/:id",
  auth,
  role("admin"),
  deleteReview
);

export default router;