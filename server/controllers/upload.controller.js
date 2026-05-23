import path from "path";

/* =====================================================
   UPLOAD IMAGE
===================================================== */

export const uploadImage =
  async (req, res, next) => {

    try {

      if (!req.file) {

        return res.status(400).json({
          message:
            "File tidak ditemukan",
        });
      }

      /* =================================================
         FILE URL
      ================================================= */

      const fileUrl =

        `${req.protocol}://` +

        `${req.get("host")}` +

        `/uploads/${req.file.filename}`;

      res.json({
        url: fileUrl,
      });

    } catch (err) {

      console.error(err);

      next(err);
    }
  };