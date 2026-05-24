import mongoose from "mongoose";

const pegawaiSchema =
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
         PERSONAL INFO
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

      tanggal_masuk: {
        type: Date,
        default: Date.now,
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

pegawaiSchema.index({
  userId: 1,
});

export default mongoose.model(
  "Pegawai",
  pegawaiSchema
);