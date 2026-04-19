import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Pelanggan from "../models/pelanggan.js";
import Admin from "../models/admin.js";
import Pegawai from "../models/pegawai.js";


// REGISTER PELANGGAN
export const registerPelanggan = async (req, res, next) => {
  try {
    const { username, password, nama, no_telp } = req.body;

    const existing = await User.findOne({ username });
    if (existing) {
      throw { status: 400, message: "Username sudah digunakan" };
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hash,
      role: "pelanggan"
    });

    const pelanggan = await Pelanggan.create({
      userId: user._id,
      nama,
      no_telp
    });

    res.json({ user, pelanggan });
  } catch (err) {
    next(err);
  }
};


// REGISTER PEGAWAI
export const registerPegawai = async (req, res, next) => {
  try {
    const { username, password, nama, no_telp } = req.body;

    const existing = await User.findOne({ username });
    if (existing) {
      throw { status: 400, message: "Username sudah digunakan" };
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hash,
      role: "pegawai"
    });

    const pegawai = await Pegawai.create({
      userId: user._id,
      nama,
      no_telp
    });

    res.json({ user, pegawai });
  } catch (err) {
    next(err);
  }
};


// REGISTER ADMIN
export const registerAdmin = async (req, res, next) => {
  try {
    const { username, password, nama, no_telp } = req.body;

    const existing = await User.findOne({ username });
    if (existing) {
      throw { status: 400, message: "Username sudah digunakan" };
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hash,
      role: "admin"
    });

    const admin = await Admin.create({
      userId: user._id,
      nama,
      no_telp
    });

    res.json({ user, admin });
  } catch (err) {
    next(err);
  }
};


// LOGIN
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      throw { status: 404, message: "User tidak ditemukan" };
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw { status: 400, message: "Password salah" };
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    next(err);
  }
};