import api from "@/lib/axios";

export const getPelanggan = (params: any) =>
  api.get("/auth/users/pelanggan", { params });

export const createPelanggan = (data: any) =>
  api.post("/pelanggan", data);

export const updatePelanggan = (id: string, data: any) =>
  api.put(`/pelanggan/${id}`, data);

export const deletePelanggan = (id: string) =>
  api.patch(`/pelanggan/${id}/delete`);