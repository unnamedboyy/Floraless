import mongoose from "mongoose";

const jadwalSchema = new mongoose.Schema({
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
    required: true
  },

  tanggal_acara: {
    type: Date,
    required: true
  },

  status: {
    type: String,
    enum: ["booked", "ongoing", "done"],
    default: "booked"
  }

}, { timestamps: true });

jadwalSchema.index({ tanggal_acara: 1 });
jadwalSchema.index({ ticketId: 1 });

export default mongoose.model("Jadwal", jadwalSchema);