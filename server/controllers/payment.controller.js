import mongoose from "mongoose";
import Payment from "../models/payment.js";
import Order from "../models/order.js";

export const createPayment = async (req, res, next) => {
  try {
    const { orderId, tipe, nominal, tanggal } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw { status: 400, message: "orderId tidak valid" };
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw { status: 404, message: "Order tidak ditemukan" };
    }

    if (!nominal || nominal <= 0) {
      throw { status: 400, message: "Nominal harus lebih dari 0" };
    }

    const validTipe = ["DP1", "DP2", "FULL"];
    if (!validTipe.includes(tipe)) {
      throw { status: 400, message: "Tipe pembayaran tidak valid" };
    }

    const payment = await Payment.create({
      orderId,
      tipe,
      nominal,
      tanggal,
      status: "pending"
    });

    res.json(payment);
  } catch (err) {
    next(err);
  }
};

export const getPayments = async (req, res, next) => {
  try {
    const data = await Payment.find().populate("orderId");
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getPaymentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw { status: 400, message: "ID tidak valid" };
    }

    const payment = await Payment.findById(id).populate({
      path: "orderId",
      populate: [
        { path: "pelangganId", select: "nama no_telp" },
        { path: "layananId", select: "nama harga" }
      ]
    });

    if (!payment) {
      throw { status: 404, message: "Payment tidak ditemukan" };
    }

    if (req.user.role === "pelanggan") {
      const order = await Order.findById(payment.orderId);

      if (!order || order.pelangganId.toString() !== req.user.id) {
        throw { status: 403, message: "Akses ditolak" };
      }
    }

    res.json(payment);
  } catch (err) {
    next(err);
  }
};