const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    eventDate: { type: Date, required: true },
    packageId: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
