import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    pelangganId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pelanggan",
      required: true,
    },

    layananId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Layanan",
      required: true,
    },

    pegawaiId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pegawai",
      default: null,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "in_progress",
        "done",
      ],
      default: "pending",
    },

    catatan: {
      type: String,
      default: "",
    },
  },

  {
    timestamps: true,
  }
);

/* =====================================================
   VIRTUAL RELATION
===================================================== */

ticketSchema.virtual(
  "detail",
  {
    ref: "DetailTicket",
    localField: "_id",
    foreignField: "ticketId",
    justOne: true,
  }
);

/* =====================================================
   ENABLE VIRTUAL
===================================================== */

ticketSchema.set(
  "toJSON",
  {
    virtuals: true,
  }
);

ticketSchema.set(
  "toObject",
  {
    virtuals: true,
  }
);

export default mongoose.model(
  "Ticket",
  ticketSchema
);