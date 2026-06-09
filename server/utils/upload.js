const multer = require("multer");
const path = require("path");
const fs = require("fs");

/* =========================
   STORAGE CONFIG
========================= */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // folder dari parameter URL
    const folder = req.params.folder || "misc";

    // lokasi di Railway Volume
    const uploadPath = path.join("/data/uploads", folder);

    // buat folder jika belum ada
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9);

    cb(
      null,
      uniqueName + path.extname(file.originalname)
    );
  },
});

/* =========================
   FILE FILTER
========================= */

function fileFilter(req, file, cb) {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("File harus berupa gambar"), false);
  }
}

/* =========================
   MULTER
========================= */

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

module.exports = upload;