import api from "@/lib/axios";

/* ================= GET ALL ================= */
export const getAllLayanan = (params?: any) =>
  api.get("/layanans", { params });

/* ================= CREATE ================= */
export const createLayanan = (data: any) =>
  api.post("/layanans", data);

/* ================= UPDATE ================= */
export const updateLayanan = (id: string, data: any) =>
  api.put(`/layanans/${id}`, data);

/* ================= TOGGLE ================= */
export const toggleLayanan = (id: string) =>
  api.patch(`/layanans/${id}/toggle`);

/* ================= DELETE ================= */
export const deleteLayanan = (id: string) =>
  api.delete(`/layanans/${id}`);