import api from "@/lib/axios";

/* =========================================================
   CUSTOMER CREATE BOOKING
========================================================= */

export const createTicket = (
  data: {
    layananId: string;
    tanggal: string;
    lokasi: string;
    nama_acara: string;
    catatan?: string;
  }
) =>
  api.post(
    "/tickets",
    data
  );

/* =========================================================
   GET ALL TICKETS
========================================================= */

export const getTickets = (
  params?: any
) =>
  api.get(
    "/tickets",
    {
      params,
    }
  );

/* =========================================================
   GET DETAIL
========================================================= */

export const getTicketById = (
  id: string
) =>
  api.get(
    `/tickets/${id}`
  );

/* =========================================================
   GET FULL DETAIL
========================================================= */

export const getTicketFull = (
  id: string
) =>
  api.get(
    `/tickets/${id}/full`
  );

/* =========================================================
   APPROVE TICKET
========================================================= */

export const approveTicket = (
  id: string,
  pegawaiId: string
) =>
  api.patch(
    `/tickets/${id}/approve`,
    {
      pegawaiId,
    }
  );

/* =========================================================
   UPDATE STATUS
========================================================= */

export const updateStatusTicket = (
  id: string,
  status: string
) =>
  api.patch(
    `/tickets/${id}/status`,
    {
      status,
    }
  );
