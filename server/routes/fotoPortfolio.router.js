import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";

import {
  addImage,
  getImages,
  reorderImages,
  deleteImage
} from "../controllers/fotoPortfolio.controller.js";

const router = express.Router();

router.post("/", auth, role("admin"), addImage);
router.patch("/reorder", auth, role("admin"), reorderImages);
router.delete("/:id", auth, role("admin"), deleteImage);

router.get("/:portfolioId", getImages);

export default router;