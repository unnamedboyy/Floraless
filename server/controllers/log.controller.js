import LogAktivitas from "../models/logAktivitas.js";

// =======================
// GET LOG BY TICKET
// =======================
export const getLogsByTicket = async (req, res, next) => {
  try {
    const { ticketId } = req.params;

    const logs = await LogAktivitas.find({ ticketId })
      .sort({ createdAt: -1 })
      .populate("userId", "username role"); 

    res.json({
      total: logs.length,
      data: logs
    });

  } catch (err) {
    next(err);
  }
};