import mongoose from "mongoose";

const pelangganSchema =
  new mongoose.Schema(
    {
      /* =========================
         RELASI USER
      ========================= */

      userId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      /* =========================
         BASIC INFO
      ========================= */

      nama: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        default: "",
      },

      no_telp: {
        type: String,
        default: "",
      },

      profile: {
        type: String,
        default: "",
      },

      /* =========================
         CUSTOMER INFO
      ========================= */

      alamat: {
        type: String,
        default: "",
      },

      jenis_kelamin: {
        type: String,
        enum: [
          "Laki-laki",
          "Perempuan",
        ],
        default: "Laki-laki",
      },

      tanggal_lahir: {
        type: Date,
      },

      bio: {
        type: String,
        default: "",
      },

      /* =========================
         STATUS
      ========================= */

      isActive: {
        type: Boolean,
        default: true,
      },
    },

    {
      timestamps: true,
    }
  );

/* =============================
   INDEX
============================= */

pelangganSchema.index({
  userId: 1,
});

export default mongoose.model(
  "Pelanggan",
  pelangganSchema
);