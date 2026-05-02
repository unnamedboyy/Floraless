/**
 * services/user.service.ts
 * Kelola data user (pelanggan & pegawai) oleh admin.
 *
 * GET    /users                → daftar semua user
 * GET    /users/:id            → detail user
 * PATCH  /users/:id/deactivate → nonaktifkan user
 * PATCH  /users/:id            → update data user
 */

import api, { ApiResponse } from "../lib/axios";
import { AxiosError } from "axios";

export interface UserProfile {
  _id: string;
  userId: {
    _id: string;
    username: string;
    email: string;
    role: string;
    isActive: boolean;
  };
  nama: string;
  no_telp?: string;
  createdAt: string;
}

export interface UpdateUserPayload {
  nama?: string;
  no_telp?: string;
  username?: string;
  email?: string;
}

function extractError(e: unknown, fallback: string): string {
  if (e instanceof AxiosError) return (e.response?.data as ApiResponse)?.message ?? fallback;
  return fallback;
}

const userService = {
  async getAll(role?: "pelanggan" | "pegawai"): Promise<UserProfile[]> {
    try {
      const { data } = await api.get<ApiResponse<UserProfile[]>>("/users", {
        params: role ? { role } : undefined,
      });
      return data.data;
    } catch (e) {
      throw extractError(e, "Gagal mengambil daftar user.");
    }
  },

  async getById(id: string): Promise<UserProfile> {
    try {
      const { data } = await api.get<ApiResponse<UserProfile>>(`/users/${id}`);
      return data.data;
    } catch (e) {
      throw extractError(e, "Gagal mengambil detail user.");
    }
  },

  async update(id: string, payload: UpdateUserPayload): Promise<UserProfile> {
    try {
      const { data } = await api.patch<ApiResponse<UserProfile>>(`/users/${id}`, payload);
      return data.data;
    } catch (e) {
      throw extractError(e, "Gagal mengupdate data user.");
    }
  },

  async deactivate(id: string): Promise<void> {
    try {
      await api.patch(`/users/${id}/deactivate`);
    } catch (e) {
      throw extractError(e, "Gagal menonaktifkan akun.");
    }
  },
};

export default userService;