const Chat = require("../models/Chat");
const RoomChat = require("../models/RoomChat");
const Pelanggan = require("../models/Pelanggan");
const { io } = require("../server");

/**
 * Create chat + emit socket
 */
async function createChat({
  roomId,
  sender_role,
  adminId,
  pelangganId,
  isi_chat,
}) {
  if (!sender_role || !isi_chat) {
    throw new Error("sender_role & isi_chat wajib");
  }

  let room;

  // =========================
  // PELANGGAN CHAT (auto room)
  // =========================
  if (sender_role === "pelanggan") {
    if (!pelangganId) {
      throw new Error("pelangganId wajib");
    }

    const pelanggan = await Pelanggan.findById(pelangganId);
    if (!pelanggan) {
      throw new Error("Pelanggan tidak ditemukan");
    }

    room = await RoomChat.findOne({ pelanggan: pelangganId });
    if (!room) {
      room = await RoomChat.create({ pelanggan: pelangganId });
    }
  }

  // =========================
  // ADMIN CHAT
  // =========================
  if (sender_role === "admin") {
    if (!roomId || !adminId) {
      throw new Error("roomId & adminId wajib");
    }

    room = await RoomChat.findById(roomId);
    if (!room) {
      throw new Error("Room tidak ditemukan");
    }
  }

  const chat = await Chat.create({
    room: room._id,
    sender_role,
    isi_chat,
    admin: sender_role === "admin" ? adminId : undefined,
    pelanggan: sender_role === "pelanggan" ? pelangganId : undefined,
  });

  // =========================
  // SOCKET EMIT (SINGLE POINT)
  // =========================
  io.to(`room_${room._id}`).emit("chat_new", chat);

  return { room, chat };
}

module.exports = {
  createChat,
};
