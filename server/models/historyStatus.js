import mongoose from "mongoose";

const historyStatusSchema = new mongoose.Schema({
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
    required: true
  },

  status: {
    type: String,
    required: true
  },

  keterangan: {
    type: String,
    default: ""
  }

}, { timestamps: true });

historyStatusSchema.index({ ticketId: 1 });

export default mongoose.model("HistoryStatus", historyStatusSchema);