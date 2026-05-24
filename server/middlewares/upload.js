import multer from "multer";
import path from "path";
import fs from "fs";

/* =====================================================
   STORAGE
===================================================== */

const storage =
  multer.diskStorage({

    destination:
      (req, file, cb) => {

        /* =========================
           GET FOLDER
        ========================= */

        const folder =

          req.params.folder ||

          "misc";

        /* =========================
           CREATE PATH
        ========================= */

        const uploadPath =

          `uploads/${folder}`;

        /* =========================
           CREATE DIRECTORY
        ========================= */

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

        cb(
          null,
          uploadPath
        );
      },

    filename:
      (req, file, cb) => {

        const uniqueName =

          Date.now() +

          "-" +

          Math.round(
            Math.random() * 1e9
          ) +

          path.extname(
            file.originalname
          );

        cb(
          null,
          uniqueName
        );
      },
  });

/* =====================================================
   FILTER
===================================================== */

const fileFilter =
  (req, file, cb) => {

    const allowedTypes = [

      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ];

    if (
      allowedTypes.includes(
        file.mimetype
      )
    ) {

      cb(null, true);

    } else {

      cb(
        new Error(
          "Format file tidak didukung"
        ),
        false
      );
    }
  };

/* =====================================================
   MULTER
===================================================== */

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