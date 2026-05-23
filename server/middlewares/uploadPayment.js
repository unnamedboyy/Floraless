import multer from "multer";

import path from "path";

import fs from "fs";

import sharp from "sharp";

/* =========================================================
   DIRECTORY
========================================================= */

const uploadPath =
  "uploads/payment";

if (
  !fs.existsSync(uploadPath)
) {

  fs.mkdirSync(
    uploadPath,
    {
      recursive: true,
    }
  );
}

/* =========================================================
   STORAGE
========================================================= */

const storage =
  multer.memoryStorage();

/* =========================================================
   FILTER
========================================================= */

const fileFilter =
  (
    req,
    file,
    cb
  ) => {

    const allowed = [

      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      allowed.includes(
        file.mimetype
      )
    ) {

      cb(null, true);

    } else {

      cb(
        new Error(
          "File harus berupa gambar"
        )
      );
    }
  };

/* =========================================================
   MULTER
========================================================= */

const upload =
  multer({

    storage,

    fileFilter,

    limits: {

      fileSize:
        20 * 1024 * 1024,
    },
  });

/* =========================================================
   PROCESS IMAGE
========================================================= */

export const processPaymentImage =
  async (
    req,
    res,
    next
  ) => {

    try {

      if (!req.file) {

        return next();
      }

      const filename =
        `${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}.webp`;

      const outputPath =
        path.join(
          uploadPath,
          filename
        );

      await sharp(
        req.file.buffer
      )

      .resize({
        width: 1600,
        withoutEnlargement: true,
      })

      .webp({
        quality: 85,
      })

      .toFile(outputPath);

      req.file.filename =
        filename;

      next();

    } catch (err) {

      next(err);
    }
  };

/* =========================================================
   EXPORT
========================================================= */

export default upload;