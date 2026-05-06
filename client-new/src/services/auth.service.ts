
import api from "@/lib/axios";

/* =========================================================
   LOGIN
========================================================= */

export const login = async (data: {
  username: string;
  password: string;
}) => {

  const res = await api.post(
    "/auth/login",
    data
  );

  console.log(
    "AUTH SERVICE RESPONSE:",
    res.data
  );

  return res.data;
};

/* =========================================================
   REGISTER
========================================================= */

export const register = async (data: {
  nama: string;
  username: string;
  no_telp: string;
  password: string;
  role?: string;
}) => {

  const res = await api.post(
    "/auth/registerPelanggan",
    {
      ...data,
      role: data.role || "pelanggan",
    }
  );

  return res.data;
};

/* =========================================================
   LOGOUT
========================================================= */

export const logout = () => {

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("profile");

  window.location.href = "/login";
};

/* =========================================================
   GET USER
========================================================= */

export const getUser = () => {

  if (typeof window === "undefined") {
    return null;
  }

  const user =
    localStorage.getItem("user");

  return user
    ? JSON.parse(user)
    : null;
};

/* =========================================================
   GET PROFILE
========================================================= */

export const getProfile = () => {

  if (typeof window === "undefined") {
    return null;
  }

  const profile =
    localStorage.getItem("profile");

  return profile
    ? JSON.parse(profile)
    : null;
};

/* =========================================================
   GET TOKEN
========================================================= */

export const getToken = () => {

  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(
    "token"
  );
};

/* =========================================================
   IS LOGIN
========================================================= */

export const isLoggedIn = () => {

  return !!getToken();
};