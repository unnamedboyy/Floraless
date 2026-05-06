"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import { login } from "@/services/auth.service";

export default function LoginForm() {

  const router = useRouter();

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  /* =========================================================
     LOGIN
  ========================================================= */

  const handleLogin = async () => {

    try {

      setLoading(true);
      setError("");

      /* ================= API ================= */

      const res = await login(form);

      console.log(
        "LOGIN RESPONSE:",
        res
      );

      /* ================= VALIDATION ================= */

      if (!res?.token) {
        throw new Error(
          "Token tidak ditemukan"
        );
      }

      if (!res?.user) {
        throw new Error(
          "User tidak ditemukan"
        );
      }

      /* ================= SAVE LOCAL STORAGE ================= */

      localStorage.setItem(
        "token",
        res.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.user)
      );

      if (res.profile) {

        localStorage.setItem(
          "profile",
          JSON.stringify(res.profile)
        );

      }

      /* ================= SAVE COOKIE ================= */

      Cookies.set(
        "token",
        res.token,
        {
          path: "/",
          sameSite: "lax",
        }
      );

      Cookies.set(
        "role",
        res.user.role,
        {
          path: "/",
          sameSite: "lax",
        }
      );

      /* ================= ROLE ================= */

      const role =
        res.user.role;

      console.log(
        "ROLE:",
        role
      );

      /* ================= REDIRECT ================= */

      if (role === "admin") {

        window.location.href =
          "/admin/dashboard";

        return;

      }

      if (role === "pegawai") {

        window.location.href =
          "/pegawai/dashboard";

        return;

      }

      if (role === "pelanggan") {

        window.location.href =
          "/pelanggan/dashboard";

        return;

      }

      setError(
        "Role tidak dikenali"
      );

    } catch (err: any) {

      console.error(err);

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Login gagal"
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="space-y-5">

      {/* ================= USERNAME ================= */}
      <div className="space-y-2">

        <label
          className="
            text-sm
            font-medium
            text-white
          "
        >
          Username
        </label>

        <input
          type="text"
          placeholder="Masukkan username"
          value={form.username}
          onChange={(e) =>
            setForm({
              ...form,
              username: e.target.value,
            })
          }
          className="
            w-full
            rounded-2xl
            border
            border-white/10
            bg-white/10
            px-4
            py-3
            text-white
            placeholder:text-white/50
            outline-none
            transition
            focus:border-cyan-300/50
            focus:bg-white/15
          "
        />

      </div>

      {/* ================= PASSWORD ================= */}
      <div className="space-y-2">

        <label
          className="
            text-sm
            font-medium
            text-white
          "
        >
          Password
        </label>

        <div className="relative">

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Masukkan password"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
            className="
              w-full
              rounded-2xl
              border
              border-white/10
              bg-white/10
              px-4
              py-3
              pr-12
              text-white
              placeholder:text-white/50
              outline-none
              transition
              focus:border-cyan-300/50
              focus:bg-white/15
            "
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-white/60
              hover:text-white
              transition
            "
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>

        </div>

      </div>

      {/* ================= ERROR ================= */}
      {error && (
        <div
          className="
            rounded-2xl
            border
            border-red-400/20
            bg-red-500/10
            px-4
            py-3
            text-sm
            text-red-100
          "
        >
          {error}
        </div>
      )}

      {/* ================= BUTTON ================= */}
      <button
        onClick={handleLogin}
        disabled={loading}
        className="
          w-full
          rounded-2xl
          bg-white
          py-3
          font-semibold
          text-[#160B44]
          transition
          hover:opacity-90
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        {loading
          ? "Loading..."
          : "SIGN IN"}
      </button>

      {/* ================= REGISTER ================= */}
      <p
        className="
          text-center
          text-sm
          text-white/70
        "
      >
        Belum punya akun?{" "}

        <Link
          href="/register"
          className="
            font-semibold
            text-cyan-200
            hover:text-white
            transition
          "
        >
          Register
        </Link>

      </p>

    </div>
  );
}