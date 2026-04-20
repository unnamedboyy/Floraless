import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Pelanggan from "../models/pelanggan.js";
import Admin from "../models/admin.js";
import Pegawai from "../models/pegawai.js";


const createUser = async (username, password, role) => {
  const hash = await bcrypt.hash(password, 10);

  return await User.create({
    username,
    password: hash,
    role
  });
};

// REGISTER PELANGGAN
export const registerPelanggan = async (req, res, next) => {
  try {
    const { username, password, nama, no_telp } = req.body;

    const existing = await User.findOne({ username });
    if (existing) {
      throw { status: 400, message: "Username sudah digunakan" };
    }

    const user = await createUser(username, password, "pelanggan");

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

    const user = await createUser(username, password, "pegawai");

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

    const user = await createUser(username, password, "admin");

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

// GET ALL USER BY ROLE 
export const getUsersByRole = async (req, res, next) => {
  try {
    const { role } = req.params;

    let Model;
    if (role === "pelanggan") Model = Pelanggan;
    else if (role === "pegawai") Model = Pegawai;
    else if (role === "admin") Model = Admin;
    else throw { status: 400, message: "Role tidak valid" };

    const data = await Model.find().populate("userId", "username role");

    res.json(data);
  } catch (err) {
    next(err);
  }
};

// GET BY ID
export const getUserById = async (req, res, next) => {
  try {
    const { role, id } = req.params;

    let Model;
    if (role === "pelanggan") Model = Pelanggan;
    else if (role === "pegawai") Model = Pegawai;
    else if (role === "admin") Model = Admin;
    else throw { status: 400, message: "Role tidak valid" };

    const data = await Model.findById(id).populate("userId");

    if (!data) throw { status: 404, message: "Data tidak ditemukan" };

    res.json(data);
  } catch (err) {
    next(err);
  }
};

// UPDATE
export const updateUser = async (req, res, next) => {
  try {
    const { role, id } = req.params;

    let Model;
    if (role === "pelanggan") Model = Pelanggan;
    else if (role === "pegawai") Model = Pegawai;
    else if (role === "admin") Model = Admin;
    else throw { status: 400, message: "Role tidak valid" };

    const data = await Model.findByIdAndUpdate(id, req.body, { new: true });

    if (!data) throw { status: 404, message: "Data tidak ditemukan" };

    res.json(data);
  } catch (err) {
    next(err);
  }
};

// DELETE
export const deleteUser = async (req, res, next) => {
  try {
    const { role, id } = req.params;

    let Model;
    if (role === "pelanggan") Model = Pelanggan;
    else if (role === "pegawai") Model = Pegawai;
    else if (role === "admin") Model = Admin;
    else throw { status: 400, message: "Role tidak valid" };

    const data = await Model.findByIdAndDelete(id);
    if (!data) throw { status: 404, message: "Data tidak ditemukan" };

    await User.findByIdAndDelete(data.userId);

    res.json({ message: "Berhasil dihapus" });
  } catch (err) {
    next(err);
  }
};