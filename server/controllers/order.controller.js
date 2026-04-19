import mongoose from "mongoose";
import Order from "../models/order.js";
import Event from "../models/event.js";
import Pelanggan from "../models/pelanggan.js";
import Layanan from "../models/layanan.js";

export const createOrder = async (req, res, next) => {
  try {
    const { pelangganId, layananId, tanggal, lokasi } = req.body;

    if (!mongoose.Types.ObjectId.isValid(pelangganId)) {
      throw { status: 400, message: "pelangganId tidak valid" };
    }

    if (!mongoose.Types.ObjectId.isValid(layananId)) {
      throw { status: 400, message: "layananId tidak valid" };
    }

    const pelanggan = await Pelanggan.findById(pelangganId);
    if (!pelanggan) throw { status: 404, message: "Pelanggan tidak ditemukan" };

    const layanan = await Layanan.findById(layananId);
    if (!layanan) throw { status: 404, message: "Layanan tidak ditemukan" };

    const order = await Order.create({
      pelangganId,
      layananId,
      status: "pending"
    });

    await Event.create({
      orderId: order._id,
      tanggal_acara: tanggal,
      lokasi
    });

    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    let orders;

    if (req.user.role === "pelanggan") {
      orders = await Order.find({ pelangganId: req.user.id });
    } else {
      orders = await Order.find();
    }

    orders = await Order.populate(orders, [
      { path: "pelangganId", select: "nama" },
      { path: "layananId", select: "nama harga" }
    ]);

    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req, res, next) => {

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw { status: 400, message: "ID tidak valid" };
    } 

    const order = await Order.findById(id)
      .populate("pelangganId", "nama no_telp")
      .populate("layananId", "nama harga");

    if (!order) throw { status: 404, message: "Order tidak ditemukan" };

    if (req.user.role === "pelanggan") {
      if (order.pelangganId.toString() !== req.user.id) {
        throw { status: 403, message: "Akses ditolak" };
      }
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const approveOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) throw { status: 404, message: "Order tidak ditemukan" };

    order.status = "approved";
    await order.save();

    res.json(order);
  } catch (err) {
    next(err);
  }
};