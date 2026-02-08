const mongoose = require("mongoose");

const CalendarBlockSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true // satu hari hanya boleh satu block
  },
  reason: {
    type: String,
    default: "-"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("CalendarBlock", CalendarBlockSchema);
