import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";
import {
    createLayanan,
    getLayanan
} from "../controllers/layanan.controller.js";

const router = express.Router();

router.post("/", auth, role("admin"), createLayanan);
router.get("/", getLayanan);

export default router;