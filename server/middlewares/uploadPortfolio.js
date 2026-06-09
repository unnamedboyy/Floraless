import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";

/* =====================================================
   UPLOAD PATH (RAILWAY VOLUME)
===================================================== */

const uploadPath = path.join(
  "/data",
  "uploads",
  "portfolio"
);

/* =====================================================
   CREATE DIRECTORY
===================================================== */

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
}

/* =====================================================
   MEMORY STORAGE
===================================================== */

const storage = multer.memoryStorage();

/* =====================================================
   FILTER
===================================================== */

const fileFilter = (req, file, cb) => {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("File harus berupa gambar"),
      false
    );
  }
};

/* =====================================================
   MULTER
===================================================== */

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

/* =====================================================
   PROCESS IMAGE
===================================================== */

export const processPortfolioImages = async (
  req,
  res,
  next
) => {
  try {
    if (!req.files) {
      return next();
    }

    console.log("UPLOAD PATH:", uploadPath);

    /* ================= THUMBNAIL ================= */

    if (req.files.thumbnail) {
      const file = req.files.thumbnail[0];

      const filename =
        `${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}.webp`;

      const outputPath = path.join(
        uploadPath,
        filename
      );

      await sharp(file.buffer)
        .resize({
          width: 1400,
          withoutEnlargement: true,
        })
        .webp({
          quality: 82,
        })
        .toFile(outputPath);

      file.filename = filename;
    }

    /* ================= GALLERY ================= */

    if (req.files.gallery) {
      for (const file of req.files.gallery) {
        const filename =
          `${Date.now()}-${Math.round(
            Math.random() * 1e9
          )}.webp`;

        const outputPath = path.join(
          uploadPath,
          filename
        );

        await sharp(file.buffer)
          .resize({
            width: 1800,
            withoutEnlargement: true,
          })
          .webp({
            quality: 85,
          })
          .toFile(outputPath);

        file.filename = filename;
      }
    }

    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
};

/* =====================================================
   EXPORT
===================================================== */

export default upload;