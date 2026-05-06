import Jadwal from "../models/jadwal.js";
import Pegawai from "../models/pegawai.js";
import { logActivity } from "../utils/logger.js";

/* =========================================================
   GET JADWAL
========================================================= */
export const getJadwal = async (req, res, next) => {
  try {

    const { start, end } = req.query;

    const filter = {};

    /* ================= FILTER TANGGAL ================= */
    if (start && end) {

      filter.tanggal_acara = {
        $gte: new Date(start),
        $lte: new Date(end)
      };
    }

    /* =================================================
       ROLE FILTER
    ================================================= */

    // 🔥 PEGAWAI -> hanya lihat jadwal sendiri
    if (req.user.role === "pegawai") {

      const pegawai = await Pegawai.findOne({
        userId: req.user.id
      });

      if (!pegawai) {
        return res.json([]);
      }

      filter.pegawaiId = pegawai._id;
    }

    // 🔥 ADMIN -> lihat semua
    // tidak perlu filter pegawaiId

    /* ================= GET DATA ================= */

    const data = await Jadwal.find(filter)

      .populate("pegawaiId", "nama")

      .populate({
        path: "ticketId",
        populate: {
          path: "layananId",
          select: "nama"
        }
      });

    console.log("TOTAL JADWAL:", data.length);
    /*console.log(data);*/

    res.json(data);

  } catch (err) {
    next(err);
  }
};

/* =========================================================
   CREATE JADWAL
========================================================= */
export const createJadwal = async (req, res, next) => {
  try {
    const {
      tanggal_acara,
      pegawaiId,
      ticketId,
      title,
      lokasi,
      status
    } = req.body;

    /* ================= CEK BENTROK ================= */
    if (pegawaiId) {
      const bentrok = await Jadwal.findOne({
        pegawaiId,
        tanggal_acara
      });

      if (bentrok) {
        throw {
          status: 400,
          message: "Pegawai sudah memiliki jadwal di tanggal ini"
        };
      }
    }

    /* ================= CREATE ================= */
    const jadwal = await Jadwal.create({
      ticketId,
      pegawaiId,
      title,
      lokasi,
      tanggal_acara,
      status: status || "booked"
    });

    await logActivity({
      userId: req.user.id,
      customDescription: `Membuat jadwal baru pada ${tanggal_acara}`
    });

    res.json(jadwal);

  } catch (err) {
    next(err);
  }
};

/* =========================================================
   UPDATE JADWAL
========================================================= */
export const updateJadwal = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      tanggal_acara,
      status,
      lokasi,
      title
    } = req.body;

    /* ================= FIND ================= */
    const jadwal = await Jadwal.findById(id);

    if (!jadwal) {
      throw {
        status: 404,
        message: "Jadwal tidak ditemukan"
      };
    }

    /* ================= CEK BENTROK ================= */
    if (tanggal_acara && jadwal.pegawaiId) {
      const bentrok = await Jadwal.findOne({
        _id: { $ne: id },
        pegawaiId: jadwal.pegawaiId,
        tanggal_acara
      });

      if (bentrok) {
        throw {
          status: 400,
          message: "Jadwal bentrok"
        };
      }
    }

    /* ================= UPDATE FIELD ================= */
    if (tanggal_acara) {
      jadwal.tanggal_acara = tanggal_acara;
    }

    if (status) {
      jadwal.status = status;
    }

    if (lokasi !== undefined) {
      jadwal.lokasi = lokasi;
    }

    if (title !== undefined) {
      jadwal.title = title;
    }

    await jadwal.save();

    await logActivity({
      userId: req.user.id,
      customDescription: `Jadwal ${jadwal._id} berhasil diperbarui`
    });

    res.json(jadwal);

  } catch (err) {
    next(err);
  }
};

/* =========================================================
   DELETE JADWAL
========================================================= */
export const deleteJadwal = async (req, res, next) => {
  try {
    const { id } = req.params;

    const jadwal = await Jadwal.findById(id);

    if (!jadwal) {
      throw {
        status: 404,
        message: "Jadwal tidak ditemukan"
      };
    }

    await jadwal.deleteOne();

    await logActivity({
      userId: req.user.id,
      customDescription: `Menghapus jadwal ${jadwal._id}`
    });

    res.json({
      message: "Jadwal berhasil dihapus"
    });

  } catch (err) {
    next(err);
  }
};