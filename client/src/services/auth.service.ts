import api, { ApiResponse, saveToken, removeToken } from "../lib/axios";
import { AxiosError } from "axios";

export type Role = "admin" | "pegawai" | "pelanggan";

export interface AuthUser {
  _id: string;
  username: string;
  role: Role;
  isActive: boolean;
  profile?: { _id: string; nama: string; no_telp?: string };
}

export interface LoginPayload { username: string; password: string; }
export interface RegisterPelangganPayload { username: string; password: string; nama: string; no_telp?: string; }
export interface RegisterPegawaiPayload   { username: string; password: string; nama: string; no_telp?: string; }
export interface RegisterAdminPayload     { username: string; password: string; nama: string; }

// dummy untuk backward compat — tidak dipakai di login
export interface LoginResponse { token: string; }

function extractError(e: unknown, fallback: string): string {
  if (e instanceof AxiosError) return (e.response?.data as ApiResponse)?.message ?? e.message ?? fallback;
  return fallback;
}

function decodePayload(token: string): { id: string; role: Role } | null {
  try {
    const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(b64));
  } catch { return null; }
}

const authService = {
  async login(payload: LoginPayload): Promise<{ token: string; role: Role; id: string }> {
    try {
      const { data } = await api.post<{ token: string }>("/auth/login", payload);
      saveToken(data.token);
      const decoded = decodePayload(data.token);
      if (!decoded) throw new Error("Token tidak valid");
      return { token: data.token, role: decoded.role, id: decoded.id };
    } catch (e) { throw extractError(e, "Login gagal. Periksa username dan password Anda."); }
  },

  async registerPelanggan(payload: RegisterPelangganPayload): Promise<void> {
    try { await api.post("/auth/registerPelanggan", payload); }
    catch (e) { throw extractError(e, "Registrasi gagal. Coba lagi."); }
  },

  async registerPegawai(payload: RegisterPegawaiPayload): Promise<void> {
    try { await api.post("/auth/registerPegawai", payload); }
    catch (e) { throw extractError(e, "Gagal mendaftarkan pegawai."); }
  },

  async registerAdmin(payload: RegisterAdminPayload): Promise<void> {
    try { await api.post("/auth/registerAdmin", payload); }
    catch (e) { throw extractError(e, "Gagal mendaftarkan admin."); }
  },

  logout(): void { removeToken(); },

  getTokenPayload(): { id: string; role: Role } | null {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("floraless_token");
    if (!token) return null;
    return decodePayload(token);
  },

  isLoggedIn(): boolean { return !!this.getTokenPayload(); },
  getRole(): Role | null { return this.getTokenPayload()?.role ?? null; },
};

export default authService;