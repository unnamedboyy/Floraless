// pelanggan controller untuk pelanggan, karena pelanggan memiliki relasi dengan user

import Pelanggan from "../models/pelanggan.js";
import User from "../models/user.js";

/* =====================================================
   GET ALL
===================================================== */

export const getPelanggan =
  async (req, res, next) => {

    try {

      const {
        page = 1,
        limit = 10,
        search,
      } = req.query;

      let filter = {
        isActive: true,
      };

      if (search) {

        filter.nama = {
          $regex: search,
          $options: "i",
        };
      }

      const skip =
        (page - 1) * limit;

      const data =
        await Pelanggan.find(filter)

          .populate(
            "userId",
            "username role"
          )

          .skip(skip)

          .limit(Number(limit))

          .sort({
            createdAt: -1,
          });

      const total =
        await Pelanggan.countDocuments(
          filter
        );

      res.json({
        data,
        total,
        page: Number(page),
      });

    } catch (err) {

      next(err);
    }
  };

/* =====================================================
   GET DETAIL
===================================================== */

export const getPelangganById =
  async (req, res, next) => {

    try {

      const data =
        await Pelanggan.findById(
          req.params.id
        ).populate(
          "userId",
          "username role"
        );

      if (!data) {

        return res.status(404).json({
          message:
            "Pelanggan tidak ditemukan",
        });
      }

      res.json(data);

    } catch (err) {

      next(err);
    }
  };

/* =====================================================
   CREATE
===================================================== */

export const createPelanggan =
  async (req, res, next) => {

    try {

      const pelanggan =
        await Pelanggan.create({
          ...req.body,
          isActive: true,
        });

      res.json(pelanggan);

    } catch (err) {

      next(err);
    }
  };

/* =====================================================
   UPDATE
===================================================== */

export const updatePelanggan =
  async (req, res, next) => {

    try {

      const pelanggan =
        await Pelanggan.findByIdAndUpdate(

          req.params.id,

          req.body,

          {
            new: true,
          }

        ).populate(
          "userId",
          "username role"
        );

      if (!pelanggan) {

        return res.status(404).json({
          message:
            "Pelanggan tidak ditemukan",
        });
      }

      res.json(pelanggan);

    } catch (err) {

      next(err);
    }
  };

/* =====================================================
   SOFT DELETE
===================================================== */

export const deletePelanggan =
  async (req, res, next) => {

    try {

      const pelanggan =
        await Pelanggan.findById(
          req.params.id
        );

      if (!pelanggan) {

        return res.status(404).json({
          message:
            "Pelanggan tidak ditemukan",
        });
      }

      pelanggan.isActive = false;

      await pelanggan.save();

      await User.findByIdAndUpdate(

        pelanggan.userId,

        {
          isActive: false,
        }

      );

      res.json({
        message:
          "Pelanggan berhasil dinonaktifkan",
      });

    } catch (err) {

      next(err);
    }
  };