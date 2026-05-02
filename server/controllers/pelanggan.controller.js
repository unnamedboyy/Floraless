import Pelanggan from "../models/pelanggan.js";

export const getPelanggan = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    let filter = { isDeleted: false };

    if (search) {
      filter.nama = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const data = await Pelanggan.find(filter)
      .skip(skip)
      .limit(Number(limit));

    const total = await Pelanggan.countDocuments(filter);

    res.json({
      data,
      total,
      page: Number(page),
    });
  } catch (err) {
    next(err);
  }
};

export const createPelanggan = async (req, res, next) => {
  try {
    const pelanggan = await Pelanggan.create({
      ...req.body,
      isDeleted: false,
    });

    res.json(pelanggan);
  } catch (err) {
    next(err);
  }
};

export const updatePelanggan = async (req, res, next) => {
  try {
    const pelanggan = await Pelanggan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(pelanggan);
  } catch (err) {
    next(err);
  }
};

export const deletePelanggan = async (req, res, next) => {
  try {
    const pelanggan = await Pelanggan.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    res.json({ message: "Soft deleted", pelanggan });
  } catch (err) {
    next(err);
  }
};