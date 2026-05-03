import api from "@/lib/axios";

export const getVouchers = () =>
  api.get("/voucher");

export const createVoucher = (data: any) =>
  api.post("/voucher", data);

export const updateVoucher = (id: string, data: any) =>
  api.put(`/voucher/${id}`, data);

export const deleteVoucher = (id: string) =>
  api.delete(`/voucher/${id}`);