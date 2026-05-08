import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath =
  "uploads/portfolio";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
}

const storage =
  multer.diskStorage({

    destination:
      (req, file, cb) => {
        cb(null, uploadPath);
      },

    filename:
      (req, file, cb) => {

        const ext =
          path.extname(
            file.originalname
          );

        cb(
          null,
          `${Date.now()}-${Math.round(
            Math.random() * 1e9
          )}${ext}`
        );
      },
  });

const fileFilter =
  (req, file, cb) => {

    const allowed =
      [
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

const upload =
  multer({
    storage,
    fileFilter,
    limits: {
      fileSize:
        20 * 1024 * 1024,
    },
  });

export default upload;