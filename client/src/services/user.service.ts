import api from "@/lib/axios";

export const getUsersByRole = (role: string, params: any) =>
  api.get(`/auth/users/${role}`, { params });

export const getUserById = (role: string, id: string) =>
  api.get(`/auth/users/${role}/${id}`);

export const createUser = (role: "pegawai" | "pelanggan", data: any) => {
  if (role === "pegawai") {
    return api.post("/auth/registerPegawai", data);
  }

  if (role === "pelanggan") {
    return api.post("/auth/registerPelanggan", data);
  }

  throw new Error("Role tidak valid");
};

export const updateUser = (
  role: string,
  id: string,
  data: any
) => api.put(`/auth/users/${role}/${id}`, data);

export const softDeleteUser = (role: string, id: string) =>
  api.patch(`/auth/users/${role}/${id}`);