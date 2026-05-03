import api from "@/lib/axios";

export const getCashbacks = () =>
  api.get("/cashback");

export const approveCashback = (id: string, bukti_tf: string) =>
  api.patch(`/cashback/${id}/process`, {
    status: "approved",
    bukti_tf,
  });

export const rejectCashback = (id: string, alasan: string) =>
  api.patch(`/cashback/${id}/process`, {
    status: "rejected",
    alasan,
  });