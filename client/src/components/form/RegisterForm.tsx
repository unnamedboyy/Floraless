"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { register } from "@/services/auth.service";

/* =========================================================
   HELPERS
========================================================= */

const isValidEmail = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const isValidPhone = (v: string) =>
  /^(\+62|62|0)8[1-9][0-9]{6,10}$/.test(v);

export default function RegisterForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    nama: "",
    username: "",
    email: "",
    no_telp: "",
    password: "",
  });

  /* =========================================================
     REGISTER
  ========================================================= */

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      /* ================= VALIDATION ================= */

      if (
        !form.nama ||
        !form.username ||
        !form.email ||
        !form.no_telp ||
        !form.password
      ) {
        setError("Semua field wajib diisi");
        return;
      }

      if (!isValidEmail(form.email)) {
        setError("Format email tidak valid (contoh: nama@email.com)");
        return;
      }

      if (!isValidPhone(form.no_telp)) {
        setError(
          "Format nomor telepon tidak valid (contoh: 08123456789 atau +628123456789)"
        );
        return;
      }

      /* ================= API ================= */

      const res = await register({
        ...form,
        role: "pelanggan",
      });

      console.log("REGISTER RESPONSE:", res);

      setSuccess("Register berhasil, mengarahkan ke halaman login...");

      /* ================= REDIRECT ================= */

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Register gagal, silakan coba lagi"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     INPUT CLASS
  ========================================================= */

  const inputClass = `
    w-full rounded-2xl border border-white/10
    bg-white/10 px-4 py-3 text-white
    placeholder:text-white/50 outline-none transition
    focus:border-white/30 focus:bg-white/15
  `;

  return (
    <div className="space-y-5">

      {/* NAMA */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Nama Lengkap</label>
        <input
          type="text"
          placeholder="Masukkan nama lengkap"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
          className={inputClass}
        />
      </div>

      {/* USERNAME */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Username</label>
        <input
          type="text"
          placeholder="Masukkan username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className={inputClass}
        />
      </div>

      {/* EMAIL */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Email</label>
        <input
          type="email"
          placeholder="Masukkan alamat email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={inputClass}
        />
      </div>

      {/* NO TELP */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Nomor Telepon</label>
        <input
          type="text"
          placeholder="Contoh: 08123456789"
          value={form.no_telp}
          onChange={(e) => setForm({ ...form, no_telp: e.target.value })}
          className={inputClass}
        />
      </div>

      {/* PASSWORD */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Masukkan password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={`${inputClass} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}

      {/* SUCCESS */}
      {success && (
        <div className="rounded-2xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-sm text-green-100">
          {success}
        </div>
      )}

      {/* BUTTON */}
      <button
        onClick={handleRegister}
        disabled={loading}
        className="
          w-full rounded-2xl bg-white py-3 font-semibold
          text-[#160B44] transition hover:opacity-90
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {loading ? "Loading..." : "CREATE ACCOUNT"}
      </button>

      {/* LOGIN LINK */}
      <p className="text-center text-sm text-white/70">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#C9AE63] hover:text-white transition"
        >
          Login
        </Link>
      </p>

    </div>
  );
}