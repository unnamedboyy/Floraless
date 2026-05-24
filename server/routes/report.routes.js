import express
from "express";

import auth
from "../middlewares/auth.js";

import {

  exportInvoice,

  getFinancialReport,

  exportFinancialReport,

} from "../controllers/report.controller.js";

const router =
  express.Router();

/* =====================================================
   INVOICE
===================================================== */

router.get(

  "/invoice/:ticketId",

  auth,

  exportInvoice
);

/* =====================================================
   FINANCIAL REPORT DATA
===================================================== */

router.get(

  "/financial",

  auth,

  getFinancialReport
);

/* =====================================================
   EXPORT FINANCIAL PDF
===================================================== */

router.get(

  "/financial/pdf",

  auth,

  exportFinancialReport
);

export default router;