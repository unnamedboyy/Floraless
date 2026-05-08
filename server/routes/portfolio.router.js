import express from "express";

import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";

import upload from "../middlewares/uploadPortfolio.js";

import {
  createPortfolio,
  getPortfolios,
  getPortfolioById,
  getPortfolioBySlug,
  updatePortfolio,
  deletePortfolio
} from "../controllers/portfolio.controller.js";

const router = express.Router();

/* ================= PUBLIC ================= */

router.get("/", getPortfolios);

router.get(
  "/slug/:slug",
  getPortfolioBySlug
);

router.get(
  "/:id",
  getPortfolioById
);

/* ================= ADMIN ================= */

router.post(
  "/",
  auth,
  role("admin"),

  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
    {
      name: "gallery",
      maxCount: 20,
    },
  ]),

  createPortfolio
);

router.put(
  "/:id",
  auth,
  role("admin"),

  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
    {
      name: "gallery",
      maxCount: 20,
    },
  ]),

  updatePortfolio
);

router.patch(
  "/:id/delete",
  auth,
  role("admin"),
  deletePortfolio
);

export default router;