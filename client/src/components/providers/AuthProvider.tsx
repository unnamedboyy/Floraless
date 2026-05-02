/**
 * components/providers/AuthProvider.tsx
 *
 * Provider yang dibungkus di root layout.tsx.
 * Tugasnya satu: panggil hydrateFromToken() saat app pertama kali mount
 * sehingga Zustand store terisi dari localStorage sebelum halaman render.
 *
 * Tanpa ini, user yang sudah login akan momentarily terlihat sebagai
 * "belum login" (flash of unauthenticated content) sampai React hydration selesai.
 *
 * Penggunaan di app/layout.tsx:
 * ```tsx
 * import AuthProvider from "@/components/providers/AuthProvider";
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <AuthProvider>{children}</AuthProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */

"use client";

import { useEffect } from "react";
import useAuthStore from "../../store/authStore";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const hydrateFromToken = useAuthStore((s) => s.hydrateFromToken);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  useEffect(() => {
    // Hanya panggil sekali saat mount
    hydrateFromToken();
  }, [hydrateFromToken]);

  /**
   * Tampilkan loading screen sederhana sampai hydration selesai.
   * Ini mencegah flash redirect yang terjadi karena middleware
   * sudah baca cookie tapi store belum terisi.
   *
   * Ganti dengan Skeleton/Spinner sesuai desain Floraless.
   */
  if (!isHydrated) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fafafa",
        }}
      >
        <span style={{ color: "#888", fontSize: 14, fontFamily: "sans-serif" }}>
          Memuat...
        </span>
      </div>
    );
  }

  return <>{children}</>;
}