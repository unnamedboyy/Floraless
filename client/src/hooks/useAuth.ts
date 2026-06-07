"use client";

import { useState } from "react";

import {
  login,
} from "@/services/auth.service";

import {
  jwtDecode,
} from "jwt-decode";

import Cookies from "../../node_modules/@types/js-cookie";

import {
  useRouter,
} from "next/navigation";

type LoginPayload = {
  username: string;
  password: string;
};

type JwtPayload = {
  id: string;

  role:
    | "admin"
    | "pegawai"
    | "pelanggan";

  exp: number;
};

export const useAuth =
  () => {

    const [loading,
      setLoading] =
      useState(false);

    const router =
      useRouter();

    /* =====================================================
       LOGIN
    ===================================================== */

    const handleLogin =
      async (
        data: LoginPayload
      ) => {

        try {

          setLoading(true);

          const res =
            await login(data);

          if (!res?.token) {

            throw new Error(
              "Token tidak ditemukan"
            );
          }

          const decoded =
            jwtDecode<JwtPayload>(
              res.token
            );

          /* =================================================
             COOKIE
          ================================================= */

          Cookies.set(
            "token",
            res.token,
            {

              expires: 1,

              path: "/",

              sameSite: "lax",
            }
          );

          Cookies.set(
            "role",
            decoded.role,
            {
              expires: 1,
              path: "/",
              sameSite: "lax",
            }
          );

          /* =================================================
             LOCAL STORAGE
          ================================================= */

          localStorage.setItem(
            "token",
            res.token
          );

          localStorage.setItem(
            "user",

            JSON.stringify(
              res.user
            )
          );

          localStorage.setItem(
            "profile",

            JSON.stringify(
              res.profile
            )
          );

          /* =================================================
             REDIRECT
          ================================================= */

          if (
            decoded.role ===
            "admin"
          ) {

            router.push(
              "/admin/dashboard"
            );

          } else if (
            decoded.role ===
            "pegawai"
          ) {

            router.push(
              "/pegawai/dashboard"
            );

          } else {

            router.push("/");
          }

          return res;

        } catch (err: any) {

          console.error(
            "LOGIN ERROR:",
            err
          );

          const message =

            err?.response?.data
              ?.message ||

            "Login gagal";

          alert(message);

          throw err;

        } finally {

          setLoading(false);
        }
      };

    /* =====================================================
       LOGOUT
    ===================================================== */

    const logout =
      () => {

        try {

          Cookies.remove(
            "token",
            {
              path: "/",
            }
          );

          Cookies.remove(
            "role",
            {
              path: "/",
            }
          );

          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );

          localStorage.removeItem(
            "profile"
          );

          router.replace(
            "/login"
          );

        } catch (err) {

          console.error(
            "LOGOUT ERROR:",
            err
          );
        }
      };

    /* =====================================================
       HELPERS
    ===================================================== */

    const getToken =
      () => {

        return (
          Cookies.get(
            "token"
          ) || null
        );
      };

    const getRole =
      (): JwtPayload["role"] | null => {

        const role =
          Cookies.get(
            "role"
          );

        if (!role) {
          return null;
        }

        return role as JwtPayload["role"];
      };

    const isAuthenticated =
      () => {

        return !!getToken();
      };

    return {
      handleLogin,
      logout,
      loading,
      getToken,
      getRole,
      isAuthenticated,
    };
  };