import api from "@/lib/axios";

/* ================= GET ALL ================= */

export const getPortfolios =
  async () => {

    const res =
      await api.get(
        "/portfolio"
      );

    return res.data;
  };

/* ================= FEATURED ================= */

export const getFeaturedPortfolios =
  async () => {

    const res =
      await api.get(
        "/portfolio/featured"
      );

    return res.data;
  };

/* ================= BY LAYANAN ================= */

export const getPortfolioByLayanan =
  async (
    layananId: string
  ) => {

    const res =
      await api.get(
        `/portfolio/by-layanan/${layananId}`
      );

    return res.data;
  };

/* ================= RELATED ================= */

export const getRelatedPortfolio =
  async (
    id: string
  ) => {

    const res =
      await api.get(
        `/portfolio/related/${id}`
      );

    return res.data;
  };

/* ================= PUBLIC ================= */

export const getGalleryPortfolio =
  async () => {

    const res =
      await api.get(
        "/portfolio"
      );

    return res.data;
  };

export const getPortfolioDetail =
  async (id: string) => {

    const res =
      await api.get(
        `/portfolio/${id}`
      );

    return res.data;
  };

export const getPortfolioBySlug =
  async (slug: string) => {

    const res =
      await api.get(
        `/portfolio/slug/${slug}`
      );

    return res.data;
  };

/* ================= CREATE ================= */

export const createPortfolio =
  async (
    data: FormData
  ) => {

    const res =
      await api.post(

        "/portfolio",

        data,

        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return res.data;
  };

/* ================= UPDATE ================= */

export const updatePortfolio =
  async (
    id: string,
    data: FormData
  ) => {

    const res =
      await api.put(

        `/portfolio/${id}`,

        data,

        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return res.data;
  };

/* ================= DELETE ================= */

export const deletePortfolio =
  async (id: string) => {

    const res =
      await api.patch(
        `/portfolio/${id}/delete`
      );

    return res.data;
  };