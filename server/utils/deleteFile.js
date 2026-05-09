import fs from "fs";
import path from "path";

export const deleteFile = (
  filePath
) => {

  try {

    if (!filePath) return;

    const cleanPath =
      filePath.startsWith("/")
        ? filePath.slice(1)
        : filePath;

    const fullPath =
      path.join(
        process.cwd(),
        cleanPath
      );

    if (
      fs.existsSync(fullPath)
    ) {

      fs.unlinkSync(fullPath);
    }

  } catch (err) {

    console.error(
      "Delete file error:",
      err
    );
  }
};