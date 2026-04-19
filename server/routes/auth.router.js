import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";
import { 
    login, 
    registerPelanggan, 
    registerPegawai, 
    registerAdmin 
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/registerPelanggan", registerPelanggan);
router.post("/registerAdmin", auth, role("admin"), registerAdmin);
router.post("/registerPegawai", auth, role("admin"), registerPegawai);
router.post("/login", login);

export default router;