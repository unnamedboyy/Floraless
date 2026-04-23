import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";

import {
  createPortfolio,
  getPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio
} from "../controllers/portfolio.controller.js";

const router = express.Router();

router.get("/", getPortfolios);
router.get("/:id", getPortfolioById);

router.post("/", auth, role("admin"), createPortfolio);
router.put("/:id", auth, role("admin"), updatePortfolio);
router.patch("/:id/delete", auth, role("admin"), deletePortfolio);

export default router;