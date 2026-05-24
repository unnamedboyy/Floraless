import express from "express";

import {
  uploadImage,
} from "../controllers/upload.controller.js";

import upload from "../middlewares/upload.js";

import authMiddleware
  from "../middlewares/auth.js";

const router =
  express.Router();

/* =====================================================
   UPLOAD
===================================================== */

router.post(

  "/:folder",

  authMiddleware,

  upload.single("image"),

  uploadImage
);

export default router;