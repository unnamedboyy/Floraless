import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";
import { 
    createPayment,
    getPayments,
    getPaymentById
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/", auth, role("pelanggan"), createPayment);
router.get("/", auth, role("pegawai", "admin"), getPayments);
router.get("/:id", auth, getPaymentById);

export default router;