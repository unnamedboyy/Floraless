import Layanan from "../models/layanan.js";

/* =====================================================
   CREATE
===================================================== */

export const createLayanan = async (req, res, next) => {
  try {
    const {nama, deskripsi, harga, thumbnail, kategori,isFeatured,} = req.body;

    if (!nama?.trim())
      throw { status: 400, message: "Nama layanan wajib diisi" };

    if (nama.trim().length < 3)
      throw {status: 400, message: "Nama layanan minimal 3 karakter"};

    if (!harga || Number(harga) < 1000)
      throw {status: 400, message: "Harga minimal Rp 1.000"};

    if (deskripsi && deskripsi.length > 1000)
      throw {status: 400,message: "Deskripsi maksimal 1000 karakter"};

    const layanan = await Layanan.create({nama: nama.trim(), deskripsi: deskripsi?.trim() || "", harga, thumbnail, kategori, isFeatured: isFeatured === true || isFeatured === "true",isActive: true,
    });

    res.json({
      success: true,
      message: "Layanan berhasil dibuat",
      data: layanan,
    });

  } catch (err) {
    next(err);
  }
};

/* =====================================================
   GET ALL
===================================================== */

export const getLayanan =
  async (req, res, next) => {

    try {

      const {
        search = "",
      } = req.query;

      const filter = {
        isActive: true,
      };

      if (search) {

        filter.nama = {

          $regex: search,

          $options: "i",
        };
      }

      const data =
        await Layanan.find(filter)

          .sort({

            isFeatured: -1,

            isActive: -1,

            createdAt: -1,
          });

      res.json({

        success: true,

        data,
      });

    } catch (err) {

      next(err);
    }
  };

/* =====================================================
   DETAIL
===================================================== */

export const getLayananById =
  async (req, res, next) => {

    try {

      const data =
        await Layanan.findById(
          req.params.id
        );

      if (!data) {

        throw {

          status: 404,

          message:
            "Layanan tidak ditemukan",
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
   UPDATE
===================================================== */

export const updateLayanan = async (req, res, next) => {
  try {
    const {
      nama,
      deskripsi,
      harga,
      thumbnail,
      kategori,
      isFeatured,
      isActive,
    } = req.body;

    const layananLama = await Layanan.findById(req.params.id);

    if (!layananLama)
      throw { status: 404, message: "Layanan tidak ditemukan" };

    if (!nama?.trim())
      throw { status: 400, message: "Nama layanan wajib diisi" };

    if (nama.trim().length < 3)
      throw {
        status: 400,
        message: "Nama layanan minimal 3 karakter",
      };

    if (!harga || Number(harga) < 1000)
      throw {
        status: 400,
        message: "Harga minimal Rp 1.000",
      };

    if (deskripsi && deskripsi.length > 1000)
      throw {
        status: 400,
        message: "Deskripsi maksimal 1000 karakter",
      };

    const data = await Layanan.findByIdAndUpdate(
      req.params.id,
      {
        nama: nama.trim(),
        deskripsi: deskripsi?.trim() || "",
        harga,
        thumbnail,
        kategori,
        isFeatured: isFeatured === true || isFeatured === "true",
        isActive:
          isActive !== undefined
            ? isActive === true || isActive === "true"
            : layananLama.isActive,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Layanan berhasil diperbarui",
      data,
    });

  } catch (err) {
    next(err);
  }
};

/* =====================================================
   DELETE
===================================================== */

export const deleteLayanan = async (req, res, next) => {
  try {
    const data = await Layanan.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!data)
      throw { status: 404, message: "Layanan tidak ditemukan" };

    res.json({
      success: true,
      message: "Layanan berhasil dinonaktifkan",
      data,
    });

  } catch (err) {
    next(err);
  }
};

/* =====================================================
   TOGGLE FEATURED
===================================================== */

export const toggleLayanan =
  async (req, res, next) => {

    try {

      const layanan =
        await Layanan.findById(
          req.params.id
        );

      if (!layanan) {

        throw {

          status: 404,

          message:
            "Layanan tidak ditemukan",
        };
      }

      layanan.isFeatured =
        !layanan.isFeatured;

      await layanan.save();

      res.json({

        success: true,

        message:
          layanan.isFeatured

            ? "Layanan berhasil difeatured"

            : "Layanan berhasil diunfeatured",

        data: layanan,
      });

    } catch (err) {

      next(err);
    }
  };