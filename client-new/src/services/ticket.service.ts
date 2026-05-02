import api from "@/lib/axios";

export const getTickets = (params: any) =>
  api.get("/tickets", { params });

export const getTicketById = (id: string) =>
  api.get(`/tickets/${id}`);

export const getTicketFull = (id: string) =>
  api.get(`/tickets/${id}/full`);

export const approveTicket = (id: string, pegawaiId: string) =>
  api.patch(`/tickets/${id}/approve`, { pegawaiId });

export const updateStatusTicket = (id: string, status: string) =>
  api.patch(`/tickets/${id}/status`, { status });