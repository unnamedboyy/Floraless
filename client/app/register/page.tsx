"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const { login, user, loading } = useAuth();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [noTelepon, setNoTelepon] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loadingBtn, setLoadingBtn] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/");
      }
    }
  }, [user, loading, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nama || !noTelepon || !username || !password) {
      setError("Field wajib belum lengkap");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password tidak sama");
      return;
    }

    try {
      setLoadingBtn(true);

      const data = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          nama,
          email,
          no_telepon: noTelepon,
          username,
          password,
        }),
      });

      login({
        id: data.user._id,
        username: data.user.username,
        role: data.user.role,
      });

      router.replace("/");

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingBtn(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* BACKGROUND */}
      <Image
        src="/hero.jpg"
        alt="Register Floraless"
        fill
        className="object-cover"
        priority
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/50" />

      {/* REGISTER CARD */}
      <form
        onSubmit={handleRegister}
        className="relative z-10 w-full max-w-md space-y-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-10 shadow-2xl"
      >
        <h1 className="text-2xl font-semibold text-center text-white">
          Register Floraless
        </h1>

        <input
          type="text"
          placeholder="Nama Lengkap"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="w-full rounded-lg border border-white/30 bg-white/20 px-4 py-3 text-white placeholder-white/70 outline-none focus:border-[#C9AE63]"
        />

        <input
          type="email"
          placeholder="Email (opsional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-white/30 bg-white/20 px-4 py-3 text-white placeholder-white/70 outline-none focus:border-[#C9AE63]"
        />

        <input
          type="text"
          placeholder="No Telepon"
          value={noTelepon}
          onChange={(e) => setNoTelepon(e.target.value)}
          className="w-full rounded-lg border border-white/30 bg-white/20 px-4 py-3 text-white placeholder-white/70 outline-none focus:border-[#C9AE63]"
        />

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-lg border border-white/30 bg-white/20 px-4 py-3 text-white placeholder-white/70 outline-none focus:border-[#C9AE63]"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-white/30 bg-white/20 px-4 py-3 text-white placeholder-white/70 outline-none focus:border-[#C9AE63]"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full rounded-lg border border-white/30 bg-white/20 px-4 py-3 text-white placeholder-white/70 outline-none focus:border-[#C9AE63]"
        />

        {error && (
          <p className="text-sm text-red-400 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loadingBtn}
          className="w-full rounded-full bg-[#C9AE63] py-3 font-semibold text-white hover:opacity-90 transition"
        >
          {loadingBtn ? "Processing..." : "Register"}
        </button>

      </form>
    </div>
  );
}