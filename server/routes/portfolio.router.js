import express from "express";

import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";

import upload, {
  processPortfolioImages
} from "../middlewares/uploadPortfolio.js";

import {
  setCoverPortfolioImage,
  reorderPortfolioImages,
  createPortfolio,
  getPortfolios,
  getPortfolioById,
  getPortfolioBySlug,
  updatePortfolio,
  deletePortfolio,
  getFeaturedPortfolios,
  getPortfolioByLayanan,
  getRelatedPortfolio,
  generatePortfolioFromTicket,
} from "../controllers/portfolio.controller.js";

const router = express.Router();

/* ================= PUBLIC ================= */

router.get("/", getPortfolios);

router.get(
  "/featured",
  getFeaturedPortfolios
);

router.get(
  "/by-layanan/:layananId",
  getPortfolioByLayanan
);

router.get(
  "/slug/:slug",
  getPortfolioBySlug
);

router.get(
  "/related/:id",
  getRelatedPortfolio
);

router.get(
  "/generate-from-ticket/:ticketId",
  auth,
  generatePortfolioFromTicket
);

router.get(
  "/:id",
  getPortfolioById
);

/* ================= ADMIN ================= */

router.post(
  "/",

  auth,

  upload.fields([
    {
      name: "gallery",
      maxCount: 20,
    },
  ]),

  processPortfolioImages,

  createPortfolio
);

router.put(
  "/:id",

  auth,

  upload.fields([
    {
      name: "gallery",
      maxCount: 20,
    },
  ]),

  processPortfolioImages,

  updatePortfolio
);

router.patch("/:id/delete", auth, role("admin"), deletePortfolio);
router.patch("/image/:imageId/cover", auth, setCoverPortfolioImage);
router.patch("/reorder-images", auth, reorderPortfolioImages);

export default router;
