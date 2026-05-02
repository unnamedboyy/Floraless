
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

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

import errorHandler from "./middlewares/errorHandler.js";

const app = express();
connectDB();

console.log("JWT_SECRET:", process.env.JWT_SECRET);

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/vouchers", voucherRoutes);
app.use("/api/layanans", layananRoutes);
app.use("/api/log", logRoutes);
app.use("/api/cashback", cashbackRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/voucher", voucherRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/portfolio-images", fotoPortfolioRoutes);
app.use("/api/detail", detailRoutes);
app.use("/api/jadwal", jadwalRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/pegawai", pegawaiRouter);
app.use("/api/pelanggan", pelangganRouter);

app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log("Server running on port " + process.env.PORT)
);