/**
 * lib/axios.ts  (v2 — tambah saveCookieToken untuk middleware)
 * Instance Axios terpusat untuk seluruh proyek Floraless.
 *
 * Fitur:
 * - Base URL otomatis dari env (NEXT_PUBLIC_API_URL)
 * - Request interceptor: inject Authorization header dari localStorage
 * - Response interceptor: tangkap 401 → hapus token → redirect ke /login
 * - Type-safe response wrapper ApiResponse<T>
 */

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// ─── Konstanta ────────────────────────────────────────────────────────────────

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

const TOKEN_KEY   = "floraless_token";
const COOKIE_NAME = "floraless_token";

// ─── Type: format response standar dari backend ───────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}

// ─── Helper token ─────────────────────────────────────────────────────────────

/**
 * Ambil token dari localStorage.
 * Hanya berjalan di browser (bukan saat SSR Next.js).
 */
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Simpan JWT token ke localStorage DAN cookie.
 * Cookie diperlukan agar middleware.ts (Edge Runtime) bisa membacanya.
 */
export const saveToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  // Simpan ke cookie untuk middleware — max-age 1 hari
  const isProduction = process.env.NODE_ENV === "production";
  const secure = isProduction ? "; Secure" : "";
  document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=86400; SameSite=Lax${secure}`;
};

/**
 * Hapus JWT token dari localStorage DAN cookie.
 * Dipanggil saat logout atau sesi expired (401).
 */
export const removeToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  // Expire cookie
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
};

// ─── Buat instance Axios ──────────────────────────────────────────────────────

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000, // 15 detik
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Inject token JWT ke setiap request yang membutuhkan autentikasi.

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Handle response sukses dan error secara global.

api.interceptors.response.use(
  // ✅ Response sukses: langsung teruskan
  (response: AxiosResponse) => response,

  // ❌ Response error: tangkap dan proses
  (error: AxiosError<ApiResponse>) => {
    const status = error.response?.status;

    // 401 Unauthorized → token expired atau tidak valid
    if (status === 401) {
      removeToken();

      // Redirect ke login hanya jika di browser
      if (typeof window !== "undefined") {
        // Simpan path asal agar bisa redirect balik setelah login
        const currentPath = window.location.pathname;
        if (currentPath !== "/login") {
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      }
    }

    // 403 Forbidden → tidak punya hak akses
    if (status === 403) {
      console.warn("[Floraless] Akses ditolak:", error.response?.data?.message);
    }

    // 500 Internal Server Error
    if (status === 500) {
      console.error("[Floraless] Server error:", error.response?.data?.message);
    }

    // Teruskan error agar bisa di-handle di masing-masing service
    return Promise.reject(error);
  }
);

// ─── Helper untuk upload file (multipart/form-data) ───────────────────────────

/**
 * Buat instance khusus untuk upload file.
 * Content-Type dioverride ke multipart/form-data.
 *
 * Contoh penggunaan:
 * ```ts
 * const formData = new FormData();
 * formData.append("file", file);
 * await apiUpload.post("/portfolio-images", formData);
 * ```
 */
export const apiUpload: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 60_000, // lebih panjang untuk upload file
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Inject token juga untuk upload instance
apiUpload.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

export default api;