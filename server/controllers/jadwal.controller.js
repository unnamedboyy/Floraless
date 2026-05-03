import Jadwal from "../models/jadwal.js";
import { logActivity } from "../utils/logger.js";

export const updateJadwal = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { tanggal_acara } = req.body;

    // CEK BENTROK
    const bentrok = await Jadwal.findOne({
      tanggal_acara,
      ticketId: { $ne: ticketId }
    });

    if (bentrok) {
      throw { status: 400, message: "Jadwal bentrok" };
    }

    const jadwal = await Jadwal.findOne({ ticketId });

    if (!jadwal) {
      throw { status: 404, message: "Jadwal tidak ditemukan" };
    }

    jadwal.tanggal_acara = tanggal_acara;
    await jadwal.save();

    await logActivity({
      userId: req.user.id,
      customDescription: `Jadwal ticket ${ticketId} diubah menjadi ${tanggal_acara}`
    });

    res.json(jadwal);

  } catch (err) {
    next(err);
  }
};

export const createJadwal = async (req, res, next) => {
  try {
    const { tanggal_acara, pegawaiId, title, lokasi } = req.body;

    // 🔥 CEK BENTROK PER PEGAWAI
    if (pegawaiId) {
      const bentrok = await Jadwal.findOne({
        tanggal_acara,
        pegawaiId
      });

      if (bentrok) {
        throw { status: 400, message: "Pegawai sudah ada jadwal di tanggal ini" };
      }
    }

    const jadwal = await Jadwal.create({
      tanggal_acara,
      pegawaiId,
      title,
      lokasi
    });

    res.json(jadwal);
  } catch (err) {
    next(err);
  }
};

export const getJadwal = async (req, res, next) => {
  try {
    const { start, end, pegawaiId } = req.query;

    const filter = {};

    if (start && end) {
      filter.tanggal_acara = {
        $gte: new Date(start),
        $lte: new Date(end)
      };
    }

    if (pegawaiId) {
      filter.pegawaiId = pegawaiId;
    }

    const data = await Jadwal.find(filter)
      .populate("pegawaiId", "nama")
      .populate("ticketId");

    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const deleteJadwal = async (req, res, next) => {
  try {
    const { id } = req.params;

    const jadwal = await Jadwal.findById(id);

    if (!jadwal) {
      throw { status: 404, message: "Jadwal tidak ditemukan" };
    }

    await jadwal.deleteOne();

    res.json({ message: "Jadwal berhasil dihapus" });
  } catch (err) {
    next(err);
  }
};