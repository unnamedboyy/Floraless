import DetailTicket from "../models/detailTicket.js";
import { logActivity } from "../utils/logger.js";

export const updateDetail = async (req, res, next) => {
  try {
    const { ticketId } = req.params;

    const detail = await DetailTicket.findOne({ ticketId });

    if (!detail) {
      throw { status: 404, message: "Detail tidak ditemukan" };
    }

    Object.assign(detail, req.body);
    await detail.save();

    await logActivity({
      userId: req.user.id,
      customDescription: `Detail ticket ${ticketId} diperbarui`
    });

    res.json(detail);

  } catch (err) {
    next(err);
  }
};