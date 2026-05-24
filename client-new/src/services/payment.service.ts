import api from "@/lib/axios";

/* =========================================================
   GET ALL
========================================================= */

export const getPayments =
  async (
    params?: any
  ) => {

    const res =
      await api.get(
        "/payments",
        {
          params,
        }
      );

    return res.data;
  };

/* =========================================================
   GET DETAIL
========================================================= */

export const getPaymentDetail =
  async (
    id: string
  ) => {

    const res =
      await api.get(
        `/payments/${id}`
      );

    return res.data;
  };

/* =========================================================
   GET BY TICKET
========================================================= */

export const getPaymentsByTicket =
  async (
    ticketId: string
  ) => {

    const res =
      await api.get(
        `/payments/ticket/${ticketId}`
      );

    return res.data;
  };

/* =========================================================
   CUSTOMER CREATE PAYMENT
========================================================= */

export const createPayment =
  async (
    data: FormData
  ) => {

    const res =
      await api.post(

        "/payments",

        data,

        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return res.data;
  };

/* =========================================================
   APPROVE
========================================================= */

export const approvePayment =
  async (
    id: string,
    catatan?: string
  ) => {

    const res =
      await api.patch(
        `/payments/${id}/approve`,
        {
          status: "approved",
          catatan,
        }
      );

    return res.data;
  };

/* =========================================================
   REJECT
========================================================= */

export const rejectPayment =
  async (
    id: string,
    catatan?: string
  ) => {

    const res =
      await api.patch(
        `/payments/${id}/reject`,
        {
          status: "rejected",
          catatan,
        }
      );

    return res.data;
  };