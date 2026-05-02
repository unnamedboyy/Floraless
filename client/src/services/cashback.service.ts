/**
 * services/cashback.service.ts
 *
 * POST   /cashback/claim        → ajukan klaim (pelanggan)
 * GET    /cashback/me           → klaim milik pelanggan yang login
 * GET    /cashback              → semua klaim (admin/pegawai)
 * PATCH  /cashback/:id/process  → approve/reject klaim (admin/pegawai)
 */

import api, { ApiResponse } from "../lib/axios";
import { apiUpload } from "../lib/axios";
import { AxiosError } from "axios";

export type CashbackStatus = "pending" | "approved" | "rejected";

export interface CashbackClaim {
  _id: string;
  voucherId: { _id: string; code: string; amount: number };
  pelangganId: { _id: string; nama: string };
  kode_voucher: string;
  nama_rekening: string;
  nomor_rekening: string;
  bank: string;
  status: CashbackStatus;
  bukti_tf?: string;      // URL bukti transfer dari pegawai
  catatan?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClaimCashbackPayload {
  kode_voucher: string;
  nama_rekening: string;
  nomor_rekening: string;
  bank: string;
}

export interface ProcessCashbackPayload {
  status: "approved" | "rejected";
  catatan?: string;
  bukti_tf?: File;        // bukti transfer dikirim saat approve
}

function extractError(e: unknown, fallback: string): string {
  if (e instanceof AxiosError) return (e.response?.data as ApiResponse)?.message ?? fallback;
  return fallback;
}

const cashbackService = {
  async claim(payload: ClaimCashbackPayload): Promise<CashbackClaim> {
    try {
      const { data } = await api.post<ApiResponse<CashbackClaim>>(
        "/cashback/claim",
        payload
      );
      return data.data;
    } catch (e) {
      throw extractError(e, "Gagal mengajukan klaim cashback.");
    }
  },

  async getMine(): Promise<CashbackClaim[]> {
    try {
      const { data } = await api.get<ApiResponse<CashbackClaim[]>>("/cashback/me");
      return data.data;
    } catch (e) {
      throw extractError(e, "Gagal mengambil data cashback.");
    }
  },

  async getAll(): Promise<CashbackClaim[]> {
    try {
      const { data } = await api.get<ApiResponse<CashbackClaim[]>>("/cashback");
      return data.data;
    } catch (e) {
      throw extractError(e, "Gagal mengambil daftar klaim.");
    }
  },

  async process(id: string, payload: ProcessCashbackPayload): Promise<CashbackClaim> {
    try {
      if (payload.bukti_tf) {
        const form = new FormData();
        form.append("status", payload.status);
        if (payload.catatan) form.append("catatan", payload.catatan);
        form.append("bukti_tf", payload.bukti_tf);
        const { data } = await apiUpload.patch<ApiResponse<CashbackClaim>>(
          `/cashback/${id}/process`,
          form
        );
        return data.data;
      }
      const { data } = await api.patch<ApiResponse<CashbackClaim>>(
        `/cashback/${id}/process`,
        { status: payload.status, catatan: payload.catatan }
      );
      return data.data;
    } catch (e) {
      throw extractError(e, "Gagal memproses klaim cashback.");
    }
  },
};

export default cashbackService;