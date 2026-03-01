"use client";

import { useState, useEffect  } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

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
      router.replace("/user/dashboard");
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
      router.replace("/user/dashboard");
    }

  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-6 border border-neutral-200 p-8 rounded-2xl"
      >
        <h1 className="text-2xl font-semibold text-center text-[#C9AE63]">
          Login Floraless
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-neutral-300 px-4 py-3 rounded-lg"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-neutral-300 px-4 py-3 rounded-lg pr-12"
          />

          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#C9AE63] py-3 text-white font-semibold hover:opacity-90"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}
