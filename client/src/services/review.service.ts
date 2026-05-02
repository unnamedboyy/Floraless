/**
 * services/review.service.ts
 *
 * POST /review              → buat review (pelanggan) → auto generate voucher
 * GET  /review/ticket/:id   → get review per ticket
 */

import api, { ApiResponse } from "../lib/axios";
import { AxiosError } from "axios";

export interface Review {
  _id: string;
  ticketId: string;
  pelangganId: { _id: string; nama: string };
  rating: 1 | 2 | 3 | 4 | 5;
  komentar: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateReviewPayload {
  ticketId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  komentar: string;
}

function extractError(e: unknown, fallback: string): string {
  if (e instanceof AxiosError) return (e.response?.data as ApiResponse)?.message ?? fallback;
  return fallback;
}

const reviewService = {
  async create(payload: CreateReviewPayload): Promise<Review> {
    try {
      const { data } = await api.post<ApiResponse<Review>>("/review", payload);
      return data.data;
    } catch (e) {
      throw extractError(e, "Gagal mengirim review.");
    }
  },

  async getByTicket(ticketId: string): Promise<Review | null> {
    try {
      const { data } = await api.get<ApiResponse<Review>>(`/review/ticket/${ticketId}`);
      return data.data;
    } catch (e) {
      throw extractError(e, "Gagal mengambil review.");
    }
  },
};

export default reviewService;