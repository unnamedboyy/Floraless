/**
 * middleware.ts  ← harus ada di root /src/ atau root proyek (bukan di dalam app/)
 *
 * Route guard Next.js berbasis JWT token.
 * Berjalan di Edge Runtime (sebelum halaman dirender) sehingga sangat cepat.
 *
 * Aturan akses:
 * ┌──────────────────────────────┬──────────────────────────────────────────┐
 * │ Path                         │ Akses                                    │
 * ├──────────────────────────────┼──────────────────────────────────────────┤
 * │ /login, /register            │ Publik. Jika sudah login → redirect dash  │
 * │ /layanan, /portfolio         │ Publik (tanpa token)                      │
 * │ /admin/*                     │ Hanya role: admin                        │
 * │ /pegawai/*                   │ Hanya role: pegawai                      │
 * │ /pelanggan/*                 │ Hanya role: pelanggan                    │
 * │ Semua lain (protected)       │ Harus login, redirect /login jika tidak  │
 * └──────────────────────────────┴──────────────────────────────────────────┘
 *
 * ⚠️  Middleware hanya membaca token dari cookie (bukan localStorage),
 *     karena Edge Runtime tidak punya akses ke browser API.
 *     Pastikan token disimpan juga ke cookie saat login.
 *     Lihat catatan di bawah tentang menyimpan token ke cookie.
 */

import { NextRequest, NextResponse } from "next/server";

// ─── Konstanta ────────────────────────────────────────────────────────────────

const TOKEN_COOKIE = "floraless_token";

/** Path yang bisa diakses tanpa login */
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/layanan",
  "/portfolio",
];

/** Prefix path yang publik (startsWith) */
const PUBLIC_PREFIXES = [
  "/layanan/",
  "/portfolio/",
  "/_next/",
  "/api/",
  "/favicon",
  "/images/",
];

/** Mapping prefix path → role yang diizinkan */
const ROLE_PATHS: Record<string, string> = {
  "/admin":     "admin",
  "/pegawai":   "pegawai",
  "/pelanggan": "pelanggan",
};

/** Dashboard per role untuk redirect setelah login */
const ROLE_DASHBOARD: Record<string, string> = {
  admin:     "/admin/dashboard",
  pegawai:   "/pegawai/dashboard",
  pelanggan: "/pelanggan/dashboard",
};

// ─── Helper: decode JWT payload di Edge Runtime ───────────────────────────────

/**
 * Decode base64url JWT payload tanpa verifikasi signature.
 * Edge Runtime tidak bisa pakai library jwt — cukup decode untuk baca role.
 *
 * ⚠️ Ini bukan verifikasi keamanan. Backend tetap yang verifikasi signature
 *    setiap kali ada request ke API.
 */
function decodeJwtPayload(token: string): { id: string; role: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // base64url → base64 → decode
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    // Edge Runtime punya atob
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// ─── Helper: cek apakah path adalah publik ───────────────────────────────────

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

// ─── Helper: ambil role yang dibutuhkan untuk path tertentu ──────────────────

function getRequiredRole(pathname: string): string | null {
  for (const [prefix, role] of Object.entries(ROLE_PATHS)) {
    if (pathname.startsWith(prefix)) return role;
  }
  return null; // path protected tapi tidak role-specific
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ambil token dari cookie
  const token = request.cookies.get(TOKEN_COOKIE)?.value ?? null;
  const payload = token ? decodeJwtPayload(token) : null;
  const role = payload?.role ?? null;

  // ── 1. Path publik ──────────────────────────────────────────────────────────
  if (isPublicPath(pathname)) {
    // Jika sudah login dan mencoba akses /login atau /register → redirect dashboard
    if (role && (pathname === "/login" || pathname === "/register")) {
      const dashboard = ROLE_DASHBOARD[role] ?? "/";
      return NextResponse.redirect(new URL(dashboard, request.url));
    }
    return NextResponse.next();
  }

  // ── 2. Belum login → redirect ke /login ────────────────────────────────────
  if (!role) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── 3. Cek akses berdasarkan role ──────────────────────────────────────────
  const requiredRole = getRequiredRole(pathname);

  if (requiredRole && role !== requiredRole) {
    // Login tapi role salah → redirect ke dashboard role yang benar
    const dashboard = ROLE_DASHBOARD[role] ?? "/";
    return NextResponse.redirect(new URL(dashboard, request.url));
  }

  // ── 4. Semua OK → lanjut ───────────────────────────────────────────────────
  return NextResponse.next();
}

// ─── Konfigurasi matcher ──────────────────────────────────────────────────────
// Middleware hanya berjalan pada path yang match pattern berikut.
// Static files (_next/static, images, dll) dikecualikan agar tidak membebani.

export const config = {
  matcher: [
    /*
     * Match semua path KECUALI:
     * - _next/static  (file statis Next.js)
     * - _next/image   (optimasi gambar)
     * - favicon.ico
     * - file gambar (.png, .jpg, .svg, dll)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff|woff2)).*)",
  ],
};

/*
 * ─── CATATAN PENTING: Token di Cookie ────────────────────────────────────────
 *
 * Middleware Next.js berjalan di Edge Runtime yang tidak bisa akses localStorage.
 * Oleh karena itu token HARUS disimpan di cookie HttpOnly agar bisa dibaca
 * middleware.
 *
 * Update authService.login() untuk menyimpan token ke cookie:
 *
 * ```ts
 * // Di authService.login(), setelah saveToken(token):
 * document.cookie = `floraless_token=${token}; path=/; max-age=86400; SameSite=Lax`;
 * // Tambahkan "; Secure" jika HTTPS (production)
 * ```
 *
 * Atau gunakan helper saveCookieToken() di lib/axios.ts:
 *
 * ```ts
 * export const saveCookieToken = (token: string) => {
 *   const isProduction = process.env.NODE_ENV === "production";
 *   const secure = isProduction ? "; Secure" : "";
 *   document.cookie =
 *     `floraless_token=${token}; path=/; max-age=86400; SameSite=Lax${secure}`;
 * };
 * ```
 *
 * Panggil saveCookieToken(token) bersamaan dengan saveToken(token) di login.
 * ─────────────────────────────────────────────────────────────────────────────
 */