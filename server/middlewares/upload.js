import multer from "multer";
import path from "path";
import fs from "fs";

/* =====================================================
   CREATE FOLDER
===================================================== */

const uploadDir =
  "public/uploads";

if (
  !fs.existsSync(
    uploadDir
  )
) {

  fs.mkdirSync(
    uploadDir,
    { recursive: true }
  );
}

/* =====================================================
   STORAGE
===================================================== */

const storage =
  multer.diskStorage({

    destination:
      (
        req,
        file,
        cb
      ) => {

        cb(
          null,
          uploadDir
        );
      },

    filename:
      (
        req,
        file,
        cb
      ) => {

        const unique =
          Date.now() +
          "-" +
          Math.round(
            Math.random() *
            1e9
          );

        cb(

          null,

          unique +
          path.extname(
            file.originalname
          )
        );
      },
  });

/* =====================================================
   FILE FILTER
===================================================== */

const fileFilter =
  (
    req,
    file,
    cb
  ) => {

    const allowed =
      [
        "image/png",
        "image/jpg",
        "image/jpeg",
        "image/webp",
      ];

    if (
      allowed.includes(
        file.mimetype
      )
    ) {

      cb(
        null,
        true
      );

    } else {

      cb(
        new Error(
          "Format file tidak didukung"
        )
      );
    }
  };

/* =====================================================
   EXPORT
===================================================== */

const upload =
  multer({

    storage,

    fileFilter,

    limits: {

      fileSize: 20 * 1024 * 1024,
    },
  });

export default upload;