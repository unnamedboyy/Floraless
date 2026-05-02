import api from "@/lib/axios";

export const getPegawai = (params: any) =>
  api.get("/auth/users/pegawai", { params });

export const createPegawai = (data: any) =>
  api.post("/pegawai", data);

export const updatePegawai = (id: string, data: any) =>
  api.put(`/pegawai/${id}`, data);

export const deletePegawai = (id: string) =>
  api.delete(`/pegawai/${id}`);

export const getPegawaiList = () =>
  api.get("/auth/users/pegawai?limit=100");