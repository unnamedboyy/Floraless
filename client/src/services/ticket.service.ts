/**
 * services/ticket.service.ts
 * Semua API call untuk modul Ticket Floraless.
 *
 * Endpoints:
 * POST   /tickets              → buat ticket (pelanggan)
 * GET    /tickets              → list ticket (role-based)
 * GET    /tickets/:id          → detail ticket
 * GET    /tickets/:id/full     → detail lengkap + payment, review, voucher, log
 * GET    /tickets/:id/paymentSummary → ringkasan pembayaran
 * PATCH  /tickets/:id/approve  → approve + assign PIC (admin/pegawai)
 * PATCH  /tickets/:id/status   → update status (admin/pegawai)
 */

import api, { ApiResponse } from "../lib/axios";
import { AxiosError } from "axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TicketStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "in_progress"
  | "done";

export interface Ticket {
  _id: string;
  pelangkanId: {
    _id: string;
    nama: string;
    no_telp?: string;
    userId?: { email: string };
  };
  layananId: {
    _id: string;
    nama: string;
    harga: number;
    deskripsi?: string;
  };
  pegawaiId?: {
    _id: string;
    nama: string;
    no_telp?: string;
  };
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DetailTicket {
  _id: string;
  ticketId: string;
  tanggal_acara: string;
  lokasi: string;
  nama_acara: string;
  catatan?: string;
}

export interface Jadwal {
  _id: string;
  ticketId: string;
  tanggal_acara: string;
  status: "booked" | "ongoing" | "done";
}

export interface LogAktivitas {
  _id: string;
  userId: { _id: string; username: string; role: string };
  ticketId?: string;
  action: string;
  description: string;
  createdAt: string;
}

export interface TicketFull extends Ticket {
  detail?: DetailTicket;
  jadwal?: Jadwal;
  payments?: import("../services/payment.service").Payment[];
  review?: import("../services/review.service").Review;
  voucher?: import("../services/voucher.service").Voucher;
  cashbackClaims?: import("../services/cashback.service").CashbackClaim[];
  logs?: LogAktivitas[];
}

export interface PaymentSummary {
  harga: number;
  dp1: { jumlah: number; status: string } | null;
  dp2: { jumlah: number; status: string } | null;
  pelunasan: { jumlah: number; status: string } | null;
  totalDibayar: number;
  sisaTagihan: number;
}

export interface CreateTicketPayload {
  layananId: string;
  tanggal_acara: string;
  lokasi: string;
  nama_acara: string;
  catatan?: string;
}

export interface ApproveTicketPayload {
  pegawaiId: string;
  status: "approved" | "rejected";
  catatan?: string;
}

export interface UpdateStatusPayload {
  status: TicketStatus;
  catatan?: string;
}

export interface TicketListParams {
  status?: TicketStatus;
  search?: string;
  page?: number;
  limit?: number;
}

// ─── Helper error ─────────────────────────────────────────────────────────────

function extractError(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    return (error.response?.data as ApiResponse)?.message ?? error.message ?? fallback;
  }
  return fallback;
}

// ─── Service ──────────────────────────────────────────────────────────────────

const ticketService = {
  async getAll(params?: TicketListParams): Promise<Ticket[]> {
    try {
      const { data } = await api.get<ApiResponse<Ticket[]>>("/tickets", { params });
      return data.data;
    } catch (e) {
      throw extractError(e, "Gagal mengambil daftar ticket.");
    }
  },

  async getById(id: string): Promise<Ticket> {
    try {
      const { data } = await api.get<ApiResponse<Ticket>>(`/tickets/${id}`);
      return data.data;
    } catch (e) {
      throw extractError(e, "Gagal mengambil detail ticket.");
    }
  },

  async getFull(id: string): Promise<TicketFull> {
    try {
      const { data } = await api.get<ApiResponse<TicketFull>>(`/tickets/${id}/full`);
      return data.data;
    } catch (e) {
      throw extractError(e, "Gagal mengambil detail lengkap ticket.");
    }
  },

  async getPaymentSummary(id: string): Promise<PaymentSummary> {
    try {
      const { data } = await api.get<ApiResponse<PaymentSummary>>(
        `/tickets/${id}/paymentSummary`
      );
      return data.data;
    } catch (e) {
      throw extractError(e, "Gagal mengambil ringkasan pembayaran.");
    }
  },

  async create(payload: CreateTicketPayload): Promise<Ticket> {
    try {
      const { data } = await api.post<ApiResponse<Ticket>>("/tickets", payload);
      return data.data;
    } catch (e) {
      throw extractError(e, "Gagal membuat ticket. Periksa tanggal acara Anda.");
    }
  },

  async approve(id: string, payload: ApproveTicketPayload): Promise<Ticket> {
    try {
      const { data } = await api.patch<ApiResponse<Ticket>>(
        `/tickets/${id}/approve`,
        payload
      );
      return data.data;
    } catch (e) {
      throw extractError(e, "Gagal mengkonfirmasi ticket.");
    }
  },

  async updateStatus(id: string, payload: UpdateStatusPayload): Promise<Ticket> {
    try {
      const { data } = await api.patch<ApiResponse<Ticket>>(
        `/tickets/${id}/status`,
        payload
      );
      return data.data;
    } catch (e) {
      throw extractError(e, "Gagal mengupdate status ticket.");
    }
  },
};

export default ticketService;