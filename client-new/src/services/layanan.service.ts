import api from "@/lib/axios";

/* ======================================================
   GET ALL
====================================================== */

export const getAllLayanan =
  async (params?: any) => {

    const res =
      await api.get(
        "/layanans",
        {
          params,
        }
      );

    return res.data;
  };

/* ======================================================
   GET DETAIL
====================================================== */

export const getLayananById =
  async (id: string) => {

    const res =
      await api.get(
        `/layanans/${id}`
      );

    return res.data;
  };

/* ======================================================
   CREATE
====================================================== */

export const createLayanan =
  async (data: any) => {

    const res =
      await api.post(
        "/layanans",
        data
      );

    return res.data;
  };

/* ======================================================
   UPDATE
====================================================== */

export const updateLayanan =
  async (
    id: string,
    data: any
  ) => {

    const res =
      await api.put(
        `/layanans/${id}`,
        data
      );

    return res.data;
  };

/* ======================================================
   TOGGLE
====================================================== */

export const toggleLayanan =
  async (id: string) => {

    const res =
      await api.patch(
        `/layanans/${id}/toggle`
      );

    return res.data;
  };

/* ======================================================
   DELETE
====================================================== */

export const deleteLayanan =
  async (id: string) => {

    const res =
      await api.delete(
        `/layanans/${id}`
      );

    return res.data;
  };