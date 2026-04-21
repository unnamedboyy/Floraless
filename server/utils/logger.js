import LogAktivitas from "../models/logAktivitas.js";
import User from "../models/user.js";

export const logActivity = async ({
  userId = null,
  ticketId = null,
  action = null,
  meta = {},
  customDescription = null
}) => {
  try {
    let user = null;

    if (userId) {
      user = await User.findById(userId);
    }

    // =========================
    // ROLE LABEL
    // =========================
    const roleLabel = {
      admin: "Admin",
      pegawai: "Pegawai",
      pelanggan: "Pelanggan"
    };

    const label = user ? roleLabel[user.role] : "User";

    // =========================
    // TEMPLATE
    // =========================
    const templates = {
      UPDATE_JADWAL: () =>
        `${label} ${user?.username} mengubah jadwal acara menjadi ${meta.tanggal}`,

      UPDATE_STATUS: () =>
        `${label} ${user?.username} mengubah status menjadi ${meta.status}`,

      CREATE_PAYMENT: () =>
        `${label} ${user?.username} membuat pembayaran ${meta.tipe}`
    };

    let description = "";

    // =========================
    // MODE CUSTOM
    // =========================
    if (customDescription) {
      description = customDescription;

    // =========================
    // MODE TEMPLATE
    // =========================
    } else if (action && templates[action]) {
      description = templates[action]();

    } else {
      throw new Error("Log harus punya customDescription atau action");
    }

    await LogAktivitas.create({
      userId,
      ticketId,
      action,
      description
    });

  } catch (err) {
    console.error("LOG ERROR:", err.message);
  }
};

// TEMPLATE MODE
// await logActivity({
//   userId: req.user.id,
//   ticketId: ticket._id,
//   action: "UPDATE_JADWAL",
//   meta: { tanggal: "10 Mei" }
// });

// CUSTOM MODE
// await logActivity({
//   userId: req.user.id,
//   ticketId: ticket._id,
//   customDescription: `Pegawai ${req.user.id} melakukan perubahan manual`
// });