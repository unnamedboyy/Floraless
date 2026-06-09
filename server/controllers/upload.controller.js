import path from "path";

/* =====================================================
   UPLOAD IMAGE
===================================================== */

export const uploadImage = async (req, res, next) => {
  try {
    /* =========================
       CHECK FILE
    ========================= */

    if (!req.file) {
      return res.status(400).json({
        message: "File tidak ditemukan",
      });
    }

    /* =========================
       DEBUG
    ========================= */

    console.log("========== UPLOAD ==========");
    console.log(req.file);
    console.log("PATH :", req.file.path);
    console.log("DEST :", req.file.destination);
    console.log("FILE :", req.file.filename);
    console.log("============================");

    /* =========================
       BASE URL
    ========================= */

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    /* =========================
       FOLDER
    ========================= */

    const folder = req.params.folder || "misc";

    /* =========================
       FILE URL
    ========================= */

    const fileUrl = `/uploads/${folder}/${req.file.filename}`;

    /* =========================
       RESPONSE
    ========================= */

    res.json({
      message: "Upload berhasil",
      url: fileUrl,
      folder,
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      destination: req.file.destination,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    next(err);
  }
};