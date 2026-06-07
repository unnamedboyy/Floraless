import path from "path";

/* =====================================================
   UPLOAD IMAGE
===================================================== */

export const uploadImage =
  async (req, res, next) => {

    try {

      /* =========================
         CHECK FILE
      ========================= */

      if (!req.file) {

        return res.status(400).json({
          message:
            "File tidak ditemukan",
        });
      }

      /* =========================
         BASE URL
      ========================= */

      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        //  "http://127.0.0.1:5000";
        // `${req.protocol}://` +
        // `${req.get("host")}`;

      /* =========================
         FOLDER
      ========================= */

      const folder =

        req.params.folder ||

        "misc";

      /* =========================
         FILE URL
      ========================= */

      const fileUrl =

        `${baseUrl}/uploads/${folder}/${req.file.filename}`;

      /* =========================
         RESPONSE
      ========================= */

      res.json({

        message:
          "Upload berhasil",

        url: fileUrl,

        folder,

        filename:
          req.file.filename,

        originalname:
          req.file.originalname,

        mimetype:
          req.file.mimetype,

        size:
          req.file.size,
      });

    } catch (err) {

      console.error(
        "UPLOAD ERROR:",
        err
      );

      next(err);

    }
  };