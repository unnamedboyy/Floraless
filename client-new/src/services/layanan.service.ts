import api from "@/lib/axios";

export const getAllLayanan = (params?: any) =>
  api.get("/layanans", { params });

export const createLayanan = (data: any) =>
  api.post("/layanans", data);

export const updateLayanan = (id: string, data: any) =>
  api.put(`/layanans/${id}`, data);

export const toggleLayanan = (id: string) =>
  api.patch(`/layanans/${id}/toggle`);

export const deleteLayanan = (id: string) =>
  api.delete(`/layanans/${id}`);