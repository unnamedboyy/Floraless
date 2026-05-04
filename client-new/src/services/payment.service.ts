import api from "@/lib/axios";

export const getPayments = async (params: any) => {
  const res = await api.get("/payments", { params });
  return res.data;
};

export const approvePayment = async (id: string) => {
  const res = await api.patch(`/payments/${id}/approve`, {
    status: "approved",
  });
  return res.data;
};

export const rejectPayment = async (id: string) => {
  const res = await api.patch(`/payments/${id}/approve`, {
    status: "rejected",
  });
  return res.data;
};

export const getPaymentsByTicket = async (ticketId: string) => {
  const res = await api.get(`/payments/ticket/${ticketId}`);
  return res.data;
};