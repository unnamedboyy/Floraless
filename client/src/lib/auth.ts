"use client";

import Cookies from "js-cookie";

/* =========================================================
   TYPES
========================================================= */

export type UserRole =
  | "admin"
  | "pegawai"
  | "pelanggan";

export type UserData = {
  _id: string;
  username: string;
  role: UserRole;
  isActive?: boolean;
};

export type ProfileData = {
  _id?: string;
  nama?: string;
  no_telp?: string;
};

/* =========================================================
   TOKEN
========================================================= */

export const getToken = () => {

  return (
    Cookies.get("token") ||
    null
  );
};

/* =========================================================
   ROLE
========================================================= */

export const getRole =
  (): UserRole | null => {

    const role =
      Cookies.get("role");

    if (!role) {
      return null;
    }

    return role as UserRole;
  };

/* =========================================================
   USER
========================================================= */

export const getUser =
  (): UserData | null => {

    if (
      typeof window ===
      "undefined"
    ) {
      return null;
    }

    try {

      const user =
        localStorage.getItem(
          "user"
        );

      if (!user) {
        return null;
      }

      return JSON.parse(user);

    } catch {

      return null;
    }
  };

/* =========================================================
   PROFILE
========================================================= */

export const getProfile =
  (): ProfileData | null => {

    if (
      typeof window ===
      "undefined"
    ) {
      return null;
    }

    try {

      const profile =
        localStorage.getItem(
          "profile"
        );

      if (!profile) {
        return null;
      }

      return JSON.parse(
        profile
      );

    } catch {

      return null;
    }
  };

/* =========================================================
   AUTH CHECK
========================================================= */

export const isAuthenticated =
  () => {

    return !!getToken();
  };

export const isPelanggan =
  () => {

    return (
      isAuthenticated() &&
      getRole() ===
        "pelanggan"
    );
  };

export const isAdmin =
  () => {

    return (
      isAuthenticated() &&
      getRole() ===
        "admin"
    );
  };

export const isPegawai =
  () => {

    return (
      isAuthenticated() &&
      getRole() ===
        "pegawai"
    );
  };

/* =========================================================
   LOGOUT
========================================================= */

export const logout =
  () => {

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

    window.location.href =
      "/login";
  };

  export const setProfile = (
  data: any
) => {

  localStorage.setItem(
    "profile",
    JSON.stringify(data)
  );
};