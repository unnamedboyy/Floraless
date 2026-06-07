import api from "@/lib/axios";

export const getVouchers = () =>
  api.get("/vouchers");

export const createVoucher = (data: any) =>
  api.post("/vouchers", data);

export const updateVoucher = (id: string, data: any) =>
  api.put(`/vouchers/${id}`, data);

export const deleteVoucher = (id: string) =>
  api.delete(`/vouchers/${id}`);