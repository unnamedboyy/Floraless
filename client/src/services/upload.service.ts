import api from "@/lib/axios";

/* ======================================================
   UPLOAD IMAGE
====================================================== */

export const uploadImage =
  async (
    file: File,
    folder = "misc",
    onProgress?: (
      progress: number
    ) => void
  ) => {

    try {

      const formData =
        new FormData();

      formData.append(
        "image",
        file
      );

      const res =
        await api.post(

          `/upload/${folder}`,

          formData,

          {

            headers: {

              "Content-Type":
                "multipart/form-data",
            },

            /* =========================
               PROGRESS
            ========================= */

            onUploadProgress: (
              progressEvent
            ) => {

              const total =
                progressEvent.total || 1;

              const percent =
                Math.round(

                  (
                    progressEvent.loaded /
                    total
                  ) * 100
                );

              if (onProgress) {

                onProgress(percent);
              }
            },
          }
        );

      return res.data.url;

    } catch (err) {

      console.error(
        "UPLOAD ERROR:",
        err
      );

      throw err;
    }
  };