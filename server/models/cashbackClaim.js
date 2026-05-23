import mongoose from "mongoose";

const cashbackClaimSchema =
  new mongoose.Schema({

    voucherId: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "Voucher",

      required: true
    },

    pelangganId: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "Pelanggan",

      required: true
    },

    kode_voucher:
      String,

    /* =========================================
       SNAPSHOT NOMINAL
    ========================================= */

    amount: {

      type: Number,

      required: true
    },

    /* =========================================
       REKENING CUSTOMER
    ========================================= */

    nama_rekening:
      String,

    nomor_rekening:
      String,

    bank:
      String,

    /* =========================================
       STATUS
    ========================================= */

    status: {

      type: String,

      enum: [
        "pending",
        "approved",
        "rejected"
      ],

      default:
        "pending"
    },

    alasan:
      String,

    /* =========================================
       BUKTI TF CASHBACK
    ========================================= */

    bukti_tf:
      String,

    /* =========================================
       APPROVAL
    ========================================= */

    approvedBy: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "User"
    },

    approvedAt:
      Date

  }, {

    timestamps: true
  });

export default mongoose.model(
  "CashbackClaim",
  cashbackClaimSchema
);