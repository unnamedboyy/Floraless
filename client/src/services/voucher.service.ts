/**
 * services/voucher.service.ts
 *
 * GET /vouchers/me       → voucher milik pelanggan yang login
 * GET /vouchers/:code    → cari voucher by kode
 * GET /vouchers          → semua voucher (admin)
 */

import api, { ApiResponse } from "../lib/axios";
import { AxiosError } from "axios";

export interface Voucher {
  _id: string;
  code: string;                 // format: FLORA-XXXXXX
  pelangganId: { _id: string; nama: string };
  amount: number;               // 5% dari harga layanan
  isUsed: boolean;
  expiredAt: string;            // 30 hari dari tanggal dibuat
  createdAt: string;
}

function extractError(e: unknown, fallback: string): string {
  if (e instanceof AxiosError) return (e.response?.data as ApiResponse)?.message ?? fallback;
  return fallback;
}

const voucherService = {
  /** Voucher milik pelanggan yang sedang login */
  async getMine(): Promise<Voucher[]> {
    try {
      const { data } = await api.get<ApiResponse<Voucher[]>>("/vouchers/me");
      return data.data;
    } catch (e) {
      throw extractError(e, "Gagal mengambil voucher.");
    }
  },

  /** Cari voucher berdasarkan kode (untuk validasi saat klaim cashback) */
  async getByCode(code: string): Promise<Voucher> {
    try {
      const { data } = await api.get<ApiResponse<Voucher>>(`/vouchers/${code}`);
      return data.data;
    } catch (e) {
      throw extractError(e, "Kode voucher tidak ditemukan.");
    }
  },

  /** Semua voucher — hanya admin */
  async getAll(): Promise<Voucher[]> {
    try {
      const { data } = await api.get<ApiResponse<Voucher[]>>("/vouchers");
      return data.data;
    } catch (e) {
      throw extractError(e, "Gagal mengambil daftar voucher.");
    }
  },
};

export default voucherService;