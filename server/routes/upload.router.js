import express from "express";

import auth
from "../middlewares/auth.js";

import upload
from "../middlewares/upload.js";

import {
  uploadImage,
} from "../controllers/upload.controller.js";

const router =
  express.Router();

/* =====================================================
   UPLOAD IMAGE
===================================================== */

router.post(

  "/",

  auth,

  upload.single(
    "image"
  ),

  uploadImage
);

export default router;