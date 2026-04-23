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