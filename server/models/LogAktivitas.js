const mongoose = require("mongoose");

const changeSchema = new mongoose.Schema(
  {
    field: String,
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed,
  },
  { _id: false }
);

const logSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TicketPemesanan",
      required: true,
      index: true,
    },

    actor: {
      id: mongoose.Schema.Types.ObjectId,
      role: String,
    },

    action: {
      type: String,
      required: true,
    },

    changes: {
      type: [changeSchema],
      default: [],
    },

    message: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("LogAktivitas", logSchema);
