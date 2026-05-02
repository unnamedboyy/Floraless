import Layanan from "../models/layanan.js";

// CREATE
export const createLayanan = async (req, res, next) => {
  try {
    const { nama, harga } = req.body;

    if (!nama || !harga) {
      throw { status: 400, message: "Nama & harga wajib diisi" };
    }

    const layanan = await Layanan.create({ nama, harga });

    res.json(layanan);
  } catch (err) {
    next(err);
  }
};

// GET ALL + SEARCH
export const getLayanan = async (req, res, next) => {
  try {
    const { search } = req.query;

    let filter = {};
    if (search) {
      filter.nama = { $regex: search, $options: "i" };
    }

    const data = await Layanan.find(filter);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// GET BY ID
export const getLayananById = async (req, res, next) => {
  try {
    const data = await Layanan.findById(req.params.id);
    if (!data) throw { status: 404, message: "Layanan tidak ditemukan" };

    res.json(data);
  } catch (err) {
    next(err);
  }
};

// UPDATE
export const updateLayanan = async (req, res, next) => {
  try {
    const data = await Layanan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!data) throw { status: 404, message: "Layanan tidak ditemukan" };

    res.json(data);
  } catch (err) {
    next(err);
  }
};

// DELETE
export const deleteLayanan = async (req, res, next) => {
  try {
    const data = await Layanan.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!data) throw { status: 404, message: "Layanan tidak ditemukan" };

    res.json({ message: "Layanan dinonaktifkan" });
  } catch (err) {
    next(err);
  }
};

export const toggleLayanan = async (req, res, next) => {
  try {
    const layanan = await Layanan.findById(req.params.id);
    if (!layanan) throw { status: 404, message: "Tidak ditemukan" };

    layanan.isActive = !layanan.isActive;
    await layanan.save();

    res.json(layanan);
  } catch (err) {
    next(err);
  }
};