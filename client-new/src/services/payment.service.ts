import api from "@/lib/axios";

export const getPayments = (params: any) =>
  api.get("/payments", { params });

export const approvePayment = (id: string) =>
  api.patch(`/payments/${id}/approve`, {
    status: "approved",
  });

export const rejectPayment = (id: string) =>
  api.patch(`/payments/${id}/approve`, {
    status: "rejected",
  });

export const getPaymentById = (id: string) =>
  api.get(`/payments/${id}`);