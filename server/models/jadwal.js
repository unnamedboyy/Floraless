import mongoose from "mongoose";

const jadwalSchema =
  new mongoose.Schema({

    ticketId: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "Ticket",

      default: null
    },

    pegawaiId: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "Pegawai",

      default: null
    },

    title: {

      type: String,

      default: ""
    },

    catatan: {
      type: String,
      default: ""
    },

    tanggal_acara: {

      type: Date,

      required: true
    },

    status: {

      type: String,

      enum: [
        "available",
        "booked",
        "ongoing",
        "done"
      ],

      default: "available"
    }

  }, {

    timestamps: true
  });

jadwalSchema.index(
  { tanggal_acara: 1 },
  { unique: true }
);

jadwalSchema.index({
  pegawaiId: 1
});

export default mongoose.model(
  "Jadwal",
  jadwalSchema
);