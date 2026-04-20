import mongoose from "mongoose";

const detailTicketSchema = new mongoose.Schema({
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
    required: true
  },

  tanggal_acara: {
    type: Date,
    required: true
  },

  lokasi: {
    type: String,
    required: true
  },

  nama_acara: {
    type: String,
    required: true
  },

  catatan: {
    type: String,
    default: ""
  }

}, { timestamps: true });

detailTicketSchema.index({ ticketId: 1 });
detailTicketSchema.index({ tanggal_acara: 1 });

export default mongoose.model("DetailTicket", detailTicketSchema);