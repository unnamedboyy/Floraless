/**
 * services/portfolio.service.ts
 *
 * GET    /portfolio           → daftar portfolio aktif (publik)
 * GET    /portfolio/:id       → detail portfolio (publik)
 * POST   /portfolio           → buat portfolio (admin)
 * PUT    /portfolio/:id       → update portfolio (admin)
 * PATCH  /portfolio/:id/delete → soft delete (admin)
 *
 * GET    /portfolio-images/:portfolioId → list foto
 * POST   /portfolio-images              → tambah foto
 * PATCH  /portfolio-images/reorder      → reorder foto
 * DELETE /portfolio-images/:id          → hapus foto
 */

import api, { ApiResponse } from "../lib/axios";
import { apiUpload } from "../lib/axios";
import { AxiosError } from "axios";

export interface FotoPortfolio {
  _id: string;
  portfolioId: string;
  url: string;
  order: number;
  caption?: string;
}

export interface Portfolio {
  _id: string;
  ticketId?: { _id: string; nama_acara?: string };
  title: string;
  content: string;
  rating?: number;
  review?: string;
  type: "auto" | "manual";
  isActive: boolean;
  fotos?: FotoPortfolio[];
  createdAt: string;
}

export interface PortfolioPayload {
  ticketId?: string;
  title: string;
  content: string;
  rating?: number;
  review?: string;
  type?: "auto" | "manual";
}

function extractError(e: unknown, fallback: string): string {
  if (e instanceof AxiosError) return (e.response?.data as ApiResponse)?.message ?? fallback;
  return fallback;
}

const portfolioService = {
  async getAll(): Promise<Portfolio[]> {
    try {
      const { data } = await api.get<ApiResponse<Portfolio[]>>("/portfolio");
      return data.data;
    } catch (e) {
      throw extractError(e, "Gagal mengambil daftar portfolio.");
    }
  },

  async getById(id: string): Promise<Portfolio> {
    try {
      const { data } = await api.get<ApiResponse<Portfolio>>(`/portfolio/${id}`);
      return data.data;
    } catch (e) {
      throw extractError(e, "Gagal mengambil detail portfolio.");
    }
  },

  async create(payload: PortfolioPayload): Promise<Portfolio> {
    try {
      const { data } = await api.post<ApiResponse<Portfolio>>("/portfolio", payload);
      return data.data;
    } catch (e) {
      throw extractError(e, "Gagal membuat portfolio.");
    }
  },

  async update(id: string, payload: Partial<PortfolioPayload>): Promise<Portfolio> {
    try {
      const { data } = await api.put<ApiResponse<Portfolio>>(`/portfolio/${id}`, payload);
      return data.data;
    } catch (e) {
      throw extractError(e, "Gagal mengupdate portfolio.");
    }
  },

  async softDelete(id: string): Promise<void> {
    try {
      await api.patch(`/portfolio/${id}/delete`);
    } catch (e) {
      throw extractError(e, "Gagal menghapus portfolio.");
    }
  },

  // ── Foto portfolio ──────────────────────────────────────────────────────────

  async getFotos(portfolioId: string): Promise<FotoPortfolio[]> {
    try {
      const { data } = await api.get<ApiResponse<FotoPortfolio[]>>(
        `/portfolio-images/${portfolioId}`
      );
      return data.data;
    } catch (e) {
      throw extractError(e, "Gagal mengambil foto portfolio.");
    }
  },

  async addFoto(portfolioId: string, file: File, caption?: string): Promise<FotoPortfolio> {
    try {
      const form = new FormData();
      form.append("portfolioId", portfolioId);
      form.append("foto", file);
      if (caption) form.append("caption", caption);
      const { data } = await apiUpload.post<ApiResponse<FotoPortfolio>>(
        "/portfolio-images",
        form
      );
      return data.data;
    } catch (e) {
      throw extractError(e, "Gagal mengunggah foto.");
    }
  },

  async reorderFotos(orders: { id: string; order: number }[]): Promise<void> {
    try {
      await api.patch("/portfolio-images/reorder", { orders });
    } catch (e) {
      throw extractError(e, "Gagal mengatur urutan foto.");
    }
  },

  async deleteFoto(fotoId: string): Promise<void> {
    try {
      await api.delete(`/portfolio-images/${fotoId}`);
    } catch (e) {
      throw extractError(e, "Gagal menghapus foto.");
    }
  },
};

export default portfolioService;