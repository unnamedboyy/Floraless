import Voucher from "../models/voucher.js";

export const createVoucher = async (req, res, next) => {
  try {
    const data = await Voucher.create(req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};