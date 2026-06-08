import mongoose from "mongoose";

const layananSchema =
  new mongoose.Schema(

    {

      nama: {
        type: String,
        required: true,
        trim: true,
      },

      deskripsi: {
        type: String,
        default: "",
      },

      harga: {
        type: Number,
        required: true,
        default: 0,
      },

      /* =====================================================
         THUMBNAIL
      ===================================================== */

      thumbnail: {
        type: String,
        default: "",
      },

      /* =====================================================
         CATEGORY
      ===================================================== */

      kategori: {
        type: String,
        default: "",
      },

      /* =====================================================
         FEATURED
      ===================================================== */

      isFeatured: {
        type: Boolean,
        default: false,
      },

      /* =====================================================
         ACTIVE
      ===================================================== */

      isActive: {
        type: Boolean,
        default: true,
      },

    },

    {
      timestamps: true,
    }
  );

/* =====================================================
   INDEX
===================================================== */

layananSchema.index({
  nama: "text",
});

layananSchema.index({
  isActive: 1,
});

layananSchema.index({
  kategori: 1,
});

export default mongoose.model(
  "Layanan",
  layananSchema
);