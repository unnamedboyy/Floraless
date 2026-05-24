import bcrypt from "bcrypt";

import Pegawai from "../models/pegawai.js";
import User from "../models/user.js";

/* =====================================================
   CREATE PROFILE INTERNAL
===================================================== */

export const createPegawaiProfile =
  async (payload) => {

    return await Pegawai.create({

      ...payload,

      isActive: true,
    });
  };

/* =====================================================
   GET ALL PEGAWAI
===================================================== */

export const getPegawai =
  async (req, res, next) => {

    try {

      const {
        page = 1,
        limit = 10,
        search = "",
      } = req.query;

      const filter = {

        isActive: true,

        nama: {
          $regex: search,
          $options: "i",
        },
      };

      const skip =
        (page - 1) * limit;

      const data =
        await Pegawai.find(filter)

          .populate(
            "userId",
            "username role isActive"
          )

          .skip(skip)

          .limit(Number(limit))

          .sort({
            createdAt: -1,
          });

      const total =
        await Pegawai.countDocuments(
          filter
        );

      res.json({

        success: true,

        data,

        total,

        page: Number(page),

        totalPages:
          Math.ceil(
            total / limit
          ),
      });

    } catch (err) {

      next(err);

    }
  };

/* =====================================================
   CREATE PEGAWAI
===================================================== */

export const createPegawai =
  async (req, res, next) => {

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

        tanggal_masuk,

        bio,

      } = req.body;

      /* =========================
         CHECK USERNAME
      ========================= */

      const existing =
        await User.findOne({
          username,
        });

      if (existing) {

        return res.status(400).json({

          success: false,

          message:
            "Username sudah digunakan",
        });
      }

      /* =========================
         CREATE USER
      ========================= */

      const hash =
        await bcrypt.hash(
          password,
          10
        );

      const user =
        await User.create({

          username,

          password: hash,

          role: "pegawai",

          isActive: true,
        });

      /* =========================
         CREATE PROFILE
      ========================= */

      const pegawai =
        await createPegawaiProfile({

          userId:
            user._id,

          nama,

          email,

          no_telp,

          profile,

          alamat,

          jenis_kelamin,

          tanggal_lahir,

          tanggal_masuk,

          bio,
        });

      res.json({

        success: true,

        message:
          "Pegawai berhasil dibuat",

        pegawai,
      });

    } catch (err) {

      next(err);

    }
  };

/* =====================================================
   UPDATE PEGAWAI
===================================================== */

export const updatePegawai =
  async (req, res, next) => {

    try {

      const pegawai =
        await Pegawai.findById(
          req.params.id
        );

      if (!pegawai) {

        return res.status(404).json({

          success: false,

          message:
            "Pegawai tidak ditemukan",
        });
      }

      /* =========================
         UPDATE USERNAME
      ========================= */

      if (req.body.username) {

        const existingUser =
          await User.findOne({

            username:
              req.body.username,

            _id: {
              $ne:
                pegawai.userId,
            },
          });

        if (existingUser) {

          return res.status(400).json({

            success: false,

            message:
              "Username sudah digunakan",
          });
        }

        await User.findByIdAndUpdate(

          pegawai.userId,

          {
            username:
              req.body.username,
          }
        );
      }

      /* =========================
         PAYLOAD
      ========================= */

      const payload = {

        nama:
          req.body.nama,

        email:
          req.body.email,

        no_telp:
          req.body.no_telp,

        profile:
          req.body.profile,

        alamat:
          req.body.alamat,

        jenis_kelamin:
          req.body.jenis_kelamin,

        tanggal_lahir:
          req.body.tanggal_lahir,

        tanggal_masuk:
          req.body.tanggal_masuk,

        bio:
          req.body.bio,
      };

      const updated =
        await Pegawai.findByIdAndUpdate(

          req.params.id,

          payload,

          {
            new: true,
          }

        ).populate(
          "userId",
          "username role isActive"
        );

      res.json({

        success: true,

        message:
          "Pegawai berhasil diperbarui",

        data: updated,
      });

    } catch (err) {

      next(err);

    }
  };

/* =====================================================
   DELETE PEGAWAI
===================================================== */

export const deletePegawai =
  async (req, res, next) => {

    try {

      const pegawai =
        await Pegawai.findById(
          req.params.id
        );

      if (!pegawai) {

        return res.status(404).json({

          success: false,

          message:
            "Pegawai tidak ditemukan",
        });
      }

      pegawai.isActive = false;

      await pegawai.save();

      await User.findByIdAndUpdate(

        pegawai.userId,

        {
          isActive: false,
        }
      );

      res.json({

        success: true,

        message:
          "Pegawai berhasil dinonaktifkan",
      });

    } catch (err) {

      next(err);

    }
  };