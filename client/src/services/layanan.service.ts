/**
 * services/layanan.service.ts
 *
 * GET    /layanans        → daftar layanan (publik, support ?search=)
 * GET    /layanans/:id    → detail layanan (publik)
 * POST   /layanans        → tambah layanan (admin)
 * PUT    /layanans/:id    → update layanan (admin)
 * DELETE /layanans/:id    → hapus layanan (admin)
 */

import api, { ApiResponse } from "../lib/axios";
import { AxiosError } from "axios";

export interface Layanan {
  _id: string;
  nama: string;
  deskripsi: string;
  harga: number;
  createdAt: string;
  updatedAt: string;
}

export interface LayananPayload {
  nama: string;
  deskripsi: string;
  harga: number;
}

function extractError(e: unknown, fallback: string): string {
  if (e instanceof AxiosError) return (e.response?.data as ApiResponse)?.message ?? fallback;
  return fallback;
}

const layananService = {
  async getAll(search?: string): Promise<Layanan[]> {
    try {
      const { data } = await api.get<ApiResponse<Layanan[]>>("/layanans", {
        params: search ? { search } : undefined,
      });
      return data.data;
    } catch (e) {
      throw extractError(e, "Gagal mengambil daftar layanan.");
    }
  },

  async getById(id: string): Promise<Layanan> {
    try {
      const { data } = await api.get<ApiResponse<Layanan>>(`/layanans/${id}`);
      return data.data;
    } catch (e) {
      throw extractError(e, "Gagal mengambil detail layanan.");
    }
  },

  async create(payload: LayananPayload): Promise<Layanan> {
    try {
      const { data } = await api.post<ApiResponse<Layanan>>("/layanans", payload);
      return data.data;
    } catch (e) {
      throw extractError(e, "Gagal menambah layanan.");
    }
  },

  async update(id: string, payload: Partial<LayananPayload>): Promise<Layanan> {
    try {
      const { data } = await api.put<ApiResponse<Layanan>>(`/layanans/${id}`, payload);
      return data.data;
    } catch (e) {
      throw extractError(e, "Gagal mengupdate layanan.");
    }
  },

  async remove(id: string): Promise<void> {
    try {
      await api.delete(`/layanans/${id}`);
    } catch (e) {
      throw extractError(e, "Gagal menghapus layanan.");
    }
  },
};

export default layananService;