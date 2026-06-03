import api from "@/lib/axios";

export const reviewService = {

  getAll: () =>
    api.get("/reviews"),

  toggle: (id: string) =>
    api.patch(`/reviews/${id}/toggle`),

  remove: (id: string) =>
    api.delete(`/reviews/${id}`),

  create: (payload: {
    ticketId: string;
    rating: number;
    komentar: string;
  }) =>
    api.post(
      "/reviews",
      payload
    ),

};