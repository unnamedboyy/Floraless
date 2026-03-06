"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/");
      }
    }
  }, [user, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      login({
        id: data.user._id,
        username: data.user.username,
        role: data.user.role,
      });

      if (data.user.role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/");
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* BACKGROUND IMAGE */}
      <Image
        src="/hero.jpg"
        alt="Login Floraless"
        fill
        className="object-cover"
        priority
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/50" />

      {/* LOGIN CARD */}
      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-md space-y-6 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-10 shadow-2xl"
      >
        <h1 className="text-2xl font-semibold text-center text-white">
          Login Floraless
        </h1>

        {/* USERNAME */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-lg border border-white/30 bg-white/20 px-4 py-3 text-white placeholder-white/70 outline-none focus:border-[#C9AE63]"
        />

        {/* PASSWORD */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-white/30 bg-white/20 px-4 py-3 pr-12 text-white placeholder-white/70 outline-none focus:border-[#C9AE63]"
          />

          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-400 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#C9AE63] py-3 font-semibold text-white hover:opacity-90 transition"
        >
          {loading ? "Loading..." : "Login"}
        </button>

      </form>
    </div>
  );
}