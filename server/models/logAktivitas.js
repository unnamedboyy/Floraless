import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket"
  },
  action: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model("LogAktivitas", logSchema);