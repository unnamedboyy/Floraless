import api from "@/lib/axios";

export const getJadwal = (params?: any) =>
  api.get("/jadwal", { params });

export const createJadwal = (data: any) =>
  api.post("/jadwal", data);

export const updateJadwal = (id: string, data: any) =>
  api.put(`/jadwal/${id}`, data);

export const deleteJadwal = (id: string) =>
  api.delete(`/jadwal/${id}`);