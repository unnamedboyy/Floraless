import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";
import { 
    createVoucher 
} from "../controllers/voucher.controller.js";

const router = express.Router();

router.post("/", auth, role("admin"), createVoucher);

export default router;