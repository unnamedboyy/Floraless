import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import http from "http";

import connectDB from "./config/db.js";
import { initSocket } from "./socket/index.js";

/* ================= ROUTES ================= */

import authRoutes from "./routes/auth.router.js";
import ticketRoutes from "./routes/ticket.router.js";
import paymentRoutes from "./routes/payment.router.js";
import voucherRoutes from "./routes/voucher.router.js";
import layananRoutes from "./routes/layanan.router.js";
import logRoutes from "./routes/log.router.js";
import cashbackRoutes from "./routes/cashback.router.js";
import reviewRoutes from "./routes/review.router.js";
import portfolioRoutes from "./routes/portfolio.router.js";
import fotoPortfolioRoutes from "./routes/fotoPortfolio.router.js";
import detailRoutes from "./routes/detail.router.js";
import jadwalRoutes from "./routes/jadwal.router.js";
import dashboardRoutes from "./routes/dashboard.router.js";
import pegawaiRouter from "./routes/pegawai.router.js";
import pelangganRouter from "./routes/pelanggan.router.js";
import uploadRoutes from "./routes/upload.router.js";
import reportRoutes from "./routes/report.routes.js";

/* ================= MIDDLEWARE ================= */

import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();

/* ================= APP ================= */

const app = express();
const server = http.createServer(app);

/* ================= SOCKET ================= */

initSocket(server);

/* ================= MIDDLEWARE ================= */

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());

/* ================= STATIC ================= */

app.use(
  "/uploads",
  express.static(
    path.join(process.cwd(), "uploads")
  )
);

/* ================= API ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/vouchers", voucherRoutes);
app.use("/api/layanans", layananRoutes);
app.use("/api/log", logRoutes);
app.use("/api/cashback", cashbackRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/portfolio-images", fotoPortfolioRoutes);
app.use("/api/detail", detailRoutes);
app.use("/api/jadwal", jadwalRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/pegawai", pegawaiRouter);
app.use("/api/pelanggan", pelangganRouter);
app.use("/api/reports", reportRoutes);
app.use("/api/upload", uploadRoutes);

/* ================= ERROR HANDLER ================= */
app.use(errorHandler);

/* ================= START SERVER ================= */
const startServer = async () => {
  try {
    await connectDB();

    console.log("DATABASE CONNECTED");

    server.listen(process.env.PORT, () => {
      console.log(
        `Server running on port ${process.env.PORT}`
      );
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
  }
};

startServer();