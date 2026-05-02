import Pegawai from "../models/pegawai.js";

export const getPegawai = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    let filter = {};

    if (search) {
      filter.nama = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const data = await Pegawai.find(filter)
      .skip(skip)
      .limit(Number(limit));

    const total = await Pegawai.countDocuments(filter);

    res.json({
      data,
      total,
      page: Number(page),
    });
  } catch (err) {
    next(err);
  }
};

export const createPegawai = async (req, res, next) => {
  try {
    const pegawai = await Pegawai.create(req.body);
    res.json(pegawai);
  } catch (err) {
    next(err);
  }
};

export const updatePegawai = async (req, res, next) => {
  try {
    const pegawai = await Pegawai.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(pegawai);
  } catch (err) {
    next(err);
  }
};

export const deletePegawai = async (req, res, next) => {
  try {
    await Pegawai.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};