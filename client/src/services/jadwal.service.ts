/**
 * services/jadwal.service.ts
 *
 * PATCH /jadwal/:ticketId → update jadwal (validasi bentrok di backend)
 */

import api, { ApiResponse } from "../lib/axios";
import { AxiosError } from "axios";

export interface Jadwal {
  _id: string;
  ticketId: string;
  tanggal_acara: string;
  status: "booked" | "ongoing" | "done";
}

export interface UpdateJadwalPayload {
  tanggal_acara?: string;
  status?: "booked" | "ongoing" | "done";
}

function extractError(e: unknown, fallback: string): string {
  if (e instanceof AxiosError) return (e.response?.data as ApiResponse)?.message ?? fallback;
  return fallback;
}

const jadwalService = {
  async update(ticketId: string, payload: UpdateJadwalPayload): Promise<Jadwal> {
    try {
      const { data } = await api.patch<ApiResponse<Jadwal>>(
        `/jadwal/${ticketId}`,
        payload
      );
      return data.data;
    } catch (e) {
      throw extractError(e, "Gagal mengupdate jadwal. Periksa apakah tanggal sudah terpakai.");
    }
  },
};

export default jadwalService;