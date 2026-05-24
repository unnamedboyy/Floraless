import express from "express";

import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";

import upload from "../middlewares/upload.js";

import {
  login,
  registerPelanggan,
  registerPegawai,
  registerAdmin,
  getUsersByRole,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/auth.controller.js";

const router = express.Router();

/* =====================================================
   AUTH
===================================================== */

router.post(
  "/login",
  login
);

/* =====================================================
   REGISTER
===================================================== */

router.post(
  "/registerPelanggan",
  registerPelanggan
);

router.post(
  "/registerPegawai",
  auth,
  role("admin"),
  registerPegawai
);

router.post(
  "/registerAdmin",
  auth,
  role("admin"),
  registerAdmin
);

/* =====================================================
   USERS
===================================================== */

router.get(
  "/users/:role",
  auth,
  getUsersByRole
);

router.get(
  "/users/:role/:id",
  auth,
  getUserById
);

/* ================= UPDATE USER ================= */

router.put(

  "/users/:role/:id",

  auth,

  role("admin"),

  upload.single("profile"),

  updateUser
);

/* ================= DELETE USER ================= */

router.patch(

  "/users/:role/:id",

  auth,

  role("admin"),

  deleteUser
);

export default router;