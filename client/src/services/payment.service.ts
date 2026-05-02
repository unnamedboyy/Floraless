/**
 * services/payment.service.ts
 *
 * POST   /payments              → buat pembayaran (pelanggan)
 * PATCH  /payments/:id/approve  → approve/reject (pegawai)
 * GET    /payments/ticket/:id   → list payment per ticket
 * GET    /payments/:id          → detail payment
 */

import api, { ApiResponse } from "../lib/axios";
import { apiUpload } from "../lib/axios";
import { AxiosError } from "axios";

export type PaymentType   = "DP1" | "DP2" | "PELUNASAN";
export type PaymentStatus = "pending" | "approved" | "rejected";

export interface Payment {
  _id: string;
  ticketId: string;
  tipe: PaymentType;
  jumlah: number;
  status: PaymentStatus;
  bukti_tf?: string;      // URL file bukti transfer
  approvedBy?: { _id: string; nama: string };
  catatan?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentPayload {
  ticketId: string;
  tipe: PaymentType;
  jumlah: number;
  bukti_tf?: File;        // file upload opsional
}

export interface ApprovePaymentPayload {
  status: "approved" | "rejected";
  catatan?: string;
}

function extractError(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    return (error.response?.data as ApiResponse)?.message ?? error.message ?? fallback;
  }
  return fallback;
}

const paymentService = {
  async getByTicket(ticketId: string): Promise<Payment[]> {
    try {
      const { data } = await api.get<ApiResponse<Payment[]>>(
        `/payments/ticket/${ticketId}`
      );
      return data.data;
    } catch (e) {
      throw extractError(e, "Gagal mengambil data pembayaran.");
    }
  },

  async getById(id: string): Promise<Payment> {
    try {
      const { data } = await api.get<ApiResponse<Payment>>(`/payments/${id}`);
      return data.data;
    } catch (e) {
      throw extractError(e, "Gagal mengambil detail pembayaran.");
    }
  },

  /**
   * Buat pembayaran baru.
   * Jika ada file bukti_tf, gunakan multipart/form-data via apiUpload.
   */
  async create(payload: CreatePaymentPayload): Promise<Payment> {
    try {
      if (payload.bukti_tf) {
        const form = new FormData();
        form.append("ticketId", payload.ticketId);
        form.append("tipe", payload.tipe);
        form.append("jumlah", String(payload.jumlah));
        form.append("bukti_tf", payload.bukti_tf);
        const { data } = await apiUpload.post<ApiResponse<Payment>>("/payments", form);
        return data.data;
      }
      const { data } = await api.post<ApiResponse<Payment>>("/payments", {
        ticketId: payload.ticketId,
        tipe: payload.tipe,
        jumlah: payload.jumlah,
      });
      return data.data;
    } catch (e) {
      throw extractError(e, "Gagal membuat pembayaran.");
    }
  },

  async approve(id: string, payload: ApprovePaymentPayload): Promise<Payment> {
    try {
      const { data } = await api.patch<ApiResponse<Payment>>(
        `/payments/${id}/approve`,
        payload
      );
      return data.data;
    } catch (e) {
      throw extractError(e, "Gagal mengkonfirmasi pembayaran.");
    }
  },
};

export default paymentService;