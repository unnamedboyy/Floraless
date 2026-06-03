import mongoose from "mongoose";

const paymentSchema =
  new mongoose.Schema({

    ticketId: {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
    tipe: {
      type: String,
      enum: [
        "DP1",
        "DP2",
        "PELUNASAN",
      ],
      required: true,
    },

    jumlah: {
      type: Number,
      required: true,
    },

    /* =====================================================
       TRANSFER INFO
    ===================================================== */

    nama_pengirim: {

      type: String,

      default: "",
    },

    bank_pengirim: {

      type: String,

      default: "",
    },

    bukti_bayar: {

      type: String,

      default: "",
    },

    /* =====================================================
       STATUS
    ===================================================== */

    status: {

      type: String,

      enum: [
        "pending",
        "approved",
        "rejected",
      ],

      default: "pending",
    },

    approvedBy: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "Pegawai",

      default: null,
    },

    approvedAt: {

      type: Date,

      default: null,
    },

    catatan: {

      type: String,

      default: "",
    },

  }, {

    timestamps: true,
  });

/* =========================================================
   INDEX
========================================================= */

paymentSchema.index({
  ticketId: 1,
});

paymentSchema.index({
  status: 1,
});

paymentSchema.index({
  tipe: 1,
});

/* =========================================================
   EXPORT
========================================================= */

export default mongoose.model(
  "Payment",
  paymentSchema
);