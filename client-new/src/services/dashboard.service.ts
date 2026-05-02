import api from "@/lib/axios";

export const getAdminDashboard = async () => {
  const res = await api.get("/dashboard/admin");
  return res.data;
};

export const getPegawaiDashboard = async () => {
  const res = await api.get("/dashboard/pegawai");
  return res.data;
};