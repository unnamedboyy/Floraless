import api from "@/lib/axios";

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

export const getCashbacks = async () => {
  const res = await api.get("/cashback");
  return res.data;
};

export const processCashback = async (
  id: string,
  payload: any
) => {
  const res = await api.patch(
    `/cashback/${id}/process`,
    payload
  );
  return res.data;
};