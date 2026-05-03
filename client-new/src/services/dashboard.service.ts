import api from "@/lib/axios";

export const getAdminDashboard = async (params?: any) => {
  const res = await api.get("/dashboard/admin", { params });
  return res.data;
};

export const getPegawaiDashboard = async () => {
  const res = await api.get("/dashboard/pegawai");
  return res.data;
};