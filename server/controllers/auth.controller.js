// auth controller untuk autentikasi + orchestrator user multi role

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import Pelanggan from "../models/pelanggan.js";
import Pegawai from "../models/pegawai.js";
import Admin from "../models/admin.js";

import { createPegawaiProfile } from "./pegawai.controller.js";
import { createPelangganProfile } from "./pelanggan.controller.js";

/* =====================================================
   HELPERS
===================================================== */

const checkEmail = async (email, Model, excludeId = null) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw {
      status: 400,
      message: "Format email tidak valid (contoh: nama@email.com)",
    };
  }

  const existing = await Model.findOne({
    email,
    ...(excludeId && { _id: { $ne: excludeId } }),
  });

  if (existing) {
    throw {
      status: 400,
      message: "Email sudah terdaftar, silakan gunakan email lain",
    };
  }
};

const checkNoTelp = async (no_telp, Model, excludeId = null) => {
  const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;

  if (!phoneRegex.test(no_telp)) {
    throw {
      status: 400,
      message: "Format nomor telepon tidak valid (contoh: 08123456789)",
    };
  }

  const existing = await Model.findOne({
    no_telp,
    ...(excludeId && { _id: { $ne: excludeId } }),
  });

  if (existing) {
    throw {
      status: 400,
      message: "Nomor telepon sudah terdaftar, silakan gunakan nomor lain",
    };
  }
};

const createUser = async (username, password, role) => {
  const hash = await bcrypt.hash(password, 10);

  return User.create({
    username,
    password: hash,
    role,
    isActive: true,
  });
};

const getModelByRole = (role) => {
  const models = {
    pelanggan: Pelanggan,
    pegawai: Pegawai,
    admin: Admin,
  };

  const model = models[role];

  if (!model) {
    throw {
      status: 400,
      message: "Role tidak valid",
    };
  }

  return model;
};

const checkUsername = async (username, excludeId = null) => {
  const existing = await User.findOne({
    username,
    ...(excludeId && {
      _id: { $ne: excludeId },
    }),
  });

  if (existing) {
    throw {
      status: 400,
      message: "Username sudah digunakan",
    };
  }
};

const getProfileByRole = async (role, userId) => {
  const Model = getModelByRole(role);
  return Model.findOne({ userId });
};

/* =====================================================
   REGISTER PELANGGAN
===================================================== */

export const registerPelanggan = async (req, res, next) => {
  try {
    const { username, password, nama, no_telp, email, profile, alamat, jenis_kelamin, tanggal_lahir, bio } = req.body;

    await checkUsername(username);
    await checkEmail(email, Pelanggan);
    await checkNoTelp(no_telp, Pelanggan);

    const user = await createUser(username, password, "pelanggan");
    const pelanggan = await createPelangganProfile({ userId: user._id, nama, no_telp, email, profile, alamat, jenis_kelamin, tanggal_lahir, bio });

    res.json({
      success: true,
      message: "Akun pelanggan berhasil dibuat",
      user,
      pelanggan,
    });

  } catch (err) {
    next(err);
  }
};

/* =====================================================
   REGISTER PEGAWAI
===================================================== */

export const registerPegawai = async (req, res, next) => {
  try {
    const { username, password, nama, no_telp, email, profile, alamat, jenis_kelamin, tanggal_lahir, tanggal_masuk, bio } = req.body;

    await checkUsername(username);

    const user = await createUser(username, password, "pegawai");
    const pegawai = await createPegawaiProfile({ userId: user._id, nama, no_telp, email, profile, alamat, jenis_kelamin, tanggal_lahir, tanggal_masuk, bio });

    res.json({
      success: true,
      message: "Pegawai berhasil dibuat",
      user,
      pegawai,
    });

  } catch (err) {
    next(err);
  }
};

/* =====================================================
   REGISTER ADMIN
===================================================== */

export const registerAdmin = async (req, res, next) => {
  try {
    const {
      username,
      password,
      nama,
      no_telp,
    } = req.body;

    await checkUsername(username);

    const user = await createUser(
      username,
      password,
      "admin"
    );

    const admin = await Admin.create({
      userId: user._id,
      nama,
      no_telp,
      isActive: true,
    });

    res.json({
      success: true,
      message: "Admin berhasil dibuat",
      user,
      admin,
    });

  } catch (err) {
    next(err);
  }
};

/* =====================================================
   LOGIN
===================================================== */

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) throw { status: 404, message: "User tidak ditemukan" };
    if (!user.isActive) throw { status: 403, message: "Akun sudah dinonaktifkan" };

    const match = await bcrypt.compare(password, user.password);

    if (!match) throw { status: 400, message: "Password salah" };

    const token = jwt.sign( {id: user._id, role: user.role}, process.env.JWT_SECRET, { expiresIn: "1d" });
    const profile = await getProfileByRole(user.role, user._id);

    res.json({
      success: true,
      message: "Login berhasil",
      token,
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
      },
      profile,
    });
  } catch (err) {
    next(err);
  }
};

/* =====================================================
   GET USERS BY ROLE
===================================================== */

export const getUsersByRole = async (req, res, next) => {
  try {
    const { role } = req.params;

    const {
      page = 1,
      limit = 10,
      search = "",
    } = req.query;

    const Model = getModelByRole(role);

    const filter = {
      nama: {
        $regex: search,
        $options: "i",
      },
    };

    const data = await Model.find(filter)
      .populate(
        "userId",
        "username role isActive"
      )
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Model.countDocuments(
      filter
    );

    res.json({
      success: true,
      data,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });

  } catch (err) {
    next(err);
  }
};

/* =====================================================
   GET USER BY ID
===================================================== */

export const getUserById = async (req, res, next) => {
  try {
    const {
      role,
      id,
    } = req.params;

    const Model = getModelByRole(role);

    const data = await Model.findById(id)
      .populate(
        "userId",
        "username role isActive"
      );

    if (!data) {
      throw {
        status: 404,
        message: "Data tidak ditemukan",
      };
    }

    res.json({
      success: true,
      data,
    });

  } catch (err) {
    next(err);
  }
};

/* =====================================================
   UPDATE USER
===================================================== */

export const updateUser = async (req, res, next) => {
  try {
    const {
      role,
      id,
    } = req.params;

    const Model = getModelByRole(role);

    const existing = await Model.findById(id);

    if (!existing) {
      throw {
        status: 404,
        message: "Data tidak ditemukan",
      };
    }

    if (req.body.username) {
      await checkUsername(
        req.body.username,
        existing.userId
      );

      await User.findByIdAndUpdate(
        existing.userId,
        {
          username: req.body.username,
        }
      );
    }

    let profileImage = req.body.profile;

    if (req.file) {
      profileImage =
        `/uploads/misc/${req.file.filename}`;
    }

    const payload = {
      nama: req.body.nama,
      no_telp: req.body.no_telp,
      email: req.body.email,
      profile: profileImage,
      alamat: req.body.alamat,
      jenis_kelamin: req.body.jenis_kelamin,
      tanggal_lahir: req.body.tanggal_lahir,
      bio: req.body.bio,
    };

    if (role === "pegawai") {
      payload.tanggal_masuk =
        req.body.tanggal_masuk;
    }

    const data = await Model.findByIdAndUpdate(
      id,
      payload,
      { new: true }
    ).populate(
      "userId",
      "username role isActive"
    );

    res.json({
      success: true,
      message: "Data berhasil diperbarui",
      data,
    });

  } catch (err) {
    next(err);
  }
};

/* =====================================================
   DELETE USER (SOFT DELETE)
===================================================== */

export const deleteUser = async (req, res, next) => {
  try {
    const { role, id } = req.params;

    const Model = getModelByRole(role);

    const data = await Model.findById(id);

    if (!data) {
      throw {
        status: 404,
        message: "Data tidak ditemukan",
      };
    }

    // Toggle status
    data.isActive = !data.isActive;

    await data.save();

    await User.findByIdAndUpdate(
      data.userId,
      {
        isActive: data.isActive,
      }
    );

    res.json({
      success: true,
      message: data.isActive
        ? "User berhasil diaktifkan"
        : "User berhasil dinonaktifkan",
    });

  } catch (err) {
    next(err);
  }
};

/* =====================================================
   DELETE USER PERMANENT
===================================================== */

export const deleteUserPermanent = async (
  req,
  res,
  next
) => {
  try {
    const {
      role,
      id,
    } = req.params;

    const Model = getModelByRole(role);

    const data = await Model.findByIdAndDelete(
      id
    );

    if (!data) {
      throw {
        status: 404,
        message: "Data tidak ditemukan",
      };
    }

    await User.findByIdAndDelete(
      data.userId
    );

    res.json({
      success: true,
      message: "User berhasil dihapus permanen",
    });

  } catch (err) {
    next(err);
  }
};