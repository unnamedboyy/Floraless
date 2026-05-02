import api from "@/lib/axios";

export const layananService = {
  getAll: (params?: any) => api.get("/layanans", { params }),

  create: (data: any) => api.post("/layanans", data),

  update: (id: string, data: any) =>
    api.put(`/layanans/${id}`, data),

  toggle: (id: string) =>
  api.patch(`/layanans/${id}/toggle`),

  remove: (id: string) =>
    api.delete(`/layanans/${id}`)

};