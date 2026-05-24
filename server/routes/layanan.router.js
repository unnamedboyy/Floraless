import express from "express";

import {

  createLayanan,

  getLayanan,

  getLayananById,

  updateLayanan,

  deleteLayanan,

  toggleLayanan,

} from "../controllers/layanan.controller.js";

import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";

const router =
  express.Router();

/* =====================================================
   PUBLIC
===================================================== */

router.get(
  "/",
  getLayanan
);

router.get(
  "/:id",
  getLayananById
);

/* =====================================================
   ADMIN
===================================================== */

router.post(

  "/",

  auth,

  role("admin"),

  createLayanan
);

router.put(

  "/:id",

  auth,

  role("admin"),

  updateLayanan
);

router.delete(

  "/:id",

  auth,

  role("admin"),

  deleteLayanan
);

router.patch(

  "/:id/toggle",

  auth,

  role("admin"),

  toggleLayanan
);

export default router;