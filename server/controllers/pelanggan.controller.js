import bcrypt from "bcrypt";

import Pelanggan from "../models/pelanggan.js";
import User from "../models/user.js";

/* ================= CREATE PROFILE ================= */

export const createPelangganProfile = async (payload) => {
  return Pelanggan.create({
    ...payload,
    isActive: true,
  });
};

/* ================= GET ALL ================= */

export const getPelanggan = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "" } =
      req.query;

    const filter = {
      nama: { $regex: search, $options: "i" },
    };

    const skip = (page - 1) * limit;

    const data = await Pelanggan.find(filter)
      .populate("userId", "username role isActive")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total =
      await Pelanggan.countDocuments(filter);

    res.json({
      success: true,
      data,
      total,
      page: Number(page),
    });

  } catch (err) {
    next(err);
  }
};

/* ================= CREATE ================= */

export const createPelanggan = async (req, res, next) => {
  try {
    const {
      username,
      password,
      nama,
      email,
      no_telp,
      profile,
      alamat,
      jenis_kelamin,
      tanggal_lahir,
      bio,
    } = req.body;

    const existing = await User.findOne({
      username,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Username sudah digunakan",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hash,
      role: "pelanggan",
      isActive: true,
    });

    const pelanggan =
      await createPelangganProfile({
        userId: user._id,
        nama,
        email,
        no_telp,
        profile,
        alamat,
        jenis_kelamin,
        tanggal_lahir,
        bio,
      });

    res.json({
      success: true,
      message: "Pelanggan berhasil dibuat",
      pelanggan,
    });

  } catch (err) {
    next(err);
  }
};

/* ================= UPDATE ================= */

export const updatePelanggan = async (req, res, next) => {
  try {
    const pelanggan =
      await Pelanggan.findById(req.params.id);

    if (!pelanggan) {
      return res.status(404).json({
        success: false,
        message: "Pelanggan tidak ditemukan",
      });
    }

    if (req.body.username) {
      const existingUser = await User.findOne({
        username: req.body.username,
        _id: { $ne: pelanggan.userId },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Username sudah digunakan",
        });
      }

      await User.findByIdAndUpdate(
        pelanggan.userId,
        { username: req.body.username }
      );
    }

    const payload = {
      nama: req.body.nama,
      email: req.body.email,
      no_telp: req.body.no_telp,
      profile: req.body.profile,
      alamat: req.body.alamat,
      jenis_kelamin: req.body.jenis_kelamin,
      tanggal_lahir: req.body.tanggal_lahir,
      bio: req.body.bio,
    };

    const updated =
      await Pelanggan.findByIdAndUpdate(
        req.params.id,
        payload,
        { new: true }
      ).populate("userId", "username role isActive");

    res.json({
      success: true,
      message: "Pelanggan berhasil diperbarui",
      data: updated,
    });

  } catch (err) {
    next(err);
  }
};

/* ================= DELETE ================= */

export const deletePelanggan = async (req, res, next) => {
  try {
    const pelanggan =
      await Pelanggan.findById(req.params.id);

    if (!pelanggan) {
      return res.status(404).json({
        success: false,
        message: "Pelanggan tidak ditemukan",
      });
    }

    pelanggan.isActive = false;

    await pelanggan.save();

    await User.findByIdAndUpdate(
      pelanggan.userId,
      { isActive: false }
    );

    res.json({
      success: true,
      message: "Pelanggan berhasil dinonaktifkan",
    });

  } catch (err) {
    next(err);
  }
};