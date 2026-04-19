import Layanan from "../models/layanan.js";

export const createLayanan = async (req, res, next) => {
  try {
    const data = await Layanan.create(req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getLayanan = async (req, res, next) => {
  try {
    const data = await Layanan.find();
    res.json(data);
  } catch (err) {
    next(err);
  }
};