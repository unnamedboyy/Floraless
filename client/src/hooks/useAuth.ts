"use client";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import authService, { LoginPayload, RegisterPelangganPayload, RegisterPegawaiPayload, RegisterAdminPayload } from "../services/auth.service";
import useAuthStore from "../store/authStore";

const ROLE_DASHBOARD: Record<string, string> = {
  admin: "/admin/dashboard", pegawai: "/pegawai/dashboard", pelanggan: "/pelanggan/dashboard",
};

export function useAuth() {
  const router = useRouter();
  const { user, role, isLoading, isHydrated, setUser, clearUser, setLoading } = useAuthStore();

  const isLoggedIn  = !!user;
  const isAdmin     = role === "admin";
  const isPegawai   = role === "pegawai";
  const isPelanggan = role === "pelanggan";

  const login = useCallback(async (payload: LoginPayload) => {
    setLoading(true);
    try {
      const { role: userRole, id } = await authService.login(payload);
      // Backend tidak return user object, build minimal dari token
      setUser({ _id: id, username: payload.username, role: userRole, isActive: true });
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get("redirect");
      router.push(redirectTo ?? ROLE_DASHBOARD[userRole] ?? "/");
      router.refresh();
    } finally { setLoading(false); }
  }, [router, setLoading, setUser]);

  const logout = useCallback(() => {
    authService.logout(); clearUser();
    router.push("/login"); router.refresh();
  }, [router, clearUser]);

  const registerPelanggan = useCallback(async (payload: RegisterPelangganPayload) => {
    setLoading(true);
    try { await authService.registerPelanggan(payload); router.push("/login?registered=1"); }
    finally { setLoading(false); }
  }, [router, setLoading]);

  const registerPegawai = useCallback(async (payload: RegisterPegawaiPayload) => {
    setLoading(true);
    try { await authService.registerPegawai(payload); }
    finally { setLoading(false); }
  }, [setLoading]);

  const registerAdmin = useCallback(async (payload: RegisterAdminPayload) => {
    setLoading(true);
    try { await authService.registerAdmin(payload); }
    finally { setLoading(false); }
  }, [setLoading]);

  const getDashboardPath = useCallback(() => ROLE_DASHBOARD[role ?? ""] ?? "/", [role]);

  return {
    user, role, isLoading, isHydrated,
    isLoggedIn, isAdmin, isPegawai, isPelanggan,
    login, logout, registerPelanggan, registerPegawai, registerAdmin, getDashboardPath,
  };
}