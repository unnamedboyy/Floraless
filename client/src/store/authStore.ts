import { create } from "zustand";
import { devtools } from "zustand/middleware";
import authService, { AuthUser, Role } from "../services/auth.service";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthState {
  /** Data user yang sedang login. null jika belum login. */
  user: AuthUser | null;

  /** Role shorthand. Sama dengan user.role, tapi langsung accessible. */
  role: Role | null;

  /** true saat sedang proses login/logout */
  isLoading: boolean;

  /**
   * true setelah store selesai membaca localStorage pertama kali.
   * Gunakan ini untuk menghindari flash redirect sebelum state siap.
   * Contoh: jangan redirect ke /login sebelum isHydrated = true.
   */
  isHydrated: boolean;
}

interface AuthActions {
  /**
   * Set user setelah login berhasil.
   * Dipanggil oleh useAuth setelah authService.login() sukses.
   */
  setUser: (user: AuthUser) => void;

  /** Hapus user dari state (saat logout atau token expired). */
  clearUser: () => void;

  /** Set loading state */
  setLoading: (val: boolean) => void;

  /**
   * Baca token dari localStorage dan decode payload-nya.
   * Dipanggil satu kali saat app mount (di layout.tsx atau Provider).
   *
   * Karena backend tidak return full user data di token (hanya id & role),
   * kita isi state dengan data minimal dari token payload.
   * Jika butuh data lengkap (nama, no_telp), perlu tambahkan endpoint GET /auth/me
   * di backend, lalu panggil di sini.
   */
  hydrateFromToken: () => void;
}

type AuthStore = AuthState & AuthActions;

// ─── Store ────────────────────────────────────────────────────────────────────

const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      // ── Initial state ────────────────────────────────────────────────────────
      user: null,
      role: null,
      isLoading: false,
      isHydrated: false,

      // ── Actions ──────────────────────────────────────────────────────────────
      setUser: (user) =>
        set(
          { user, role: user.role },
          false,
          "auth/setUser"
        ),

      clearUser: () =>
        set(
          { user: null, role: null },
          false,
          "auth/clearUser"
        ),

      setLoading: (val) =>
        set(
          { isLoading: val },
          false,
          "auth/setLoading"
        ),

      hydrateFromToken: () => {
        const payload = authService.getTokenPayload();

        if (payload) {
          // Bangun AuthUser minimal dari token payload.
          // Field seperti nama & no_telp tidak ada di token —
          // akan diisi oleh useAuth saat fetch profile (sprint berikutnya).
          const minimalUser: AuthUser = {
            _id: payload.id,
            username: "",   // belum diketahui dari token
            email: "",      // belum diketahui dari token
            role: payload.role,
            isActive: true,
          };

          set(
            { user: minimalUser, role: payload.role, isHydrated: true },
            false,
            "auth/hydrate"
          );
        } else {
          // Tidak ada token / token invalid
          set({ isHydrated: true }, false, "auth/hydrate");
        }
      },
    }),
    { name: "FloralessAuthStore" }
  )
);

export default useAuthStore;