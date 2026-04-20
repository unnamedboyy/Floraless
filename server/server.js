
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.router.js";
import orderRoutes from "./routes/order.router.js";
import paymentRoutes from "./routes/payment.router.js";
import voucherRoutes from "./routes/voucher.router.js";
import layananRoutes from "./routes/layanan.router.js";

import errorHandler from "./middlewares/errorHandler.js";

const app = express();
connectDB();

console.log("JWT_SECRET:", process.env.JWT_SECRET);

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/vouchers", voucherRoutes);
app.use("/api/layanan", layananRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log("Server running on port " + process.env.PORT)
);