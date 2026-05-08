import api from "@/lib/axios";

export const getPortfolios =
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

export const createPortfolio =
  async (data: FormData) => {

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

export const deletePortfolio =
  async (id: string) => {

    const res =
      await api.patch(
        `/portfolio/${id}/delete`
      );

    return res.data;
  };