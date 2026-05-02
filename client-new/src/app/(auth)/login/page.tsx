"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { handleLogin, loading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const onSubmit = async () => {
    const res = await handleLogin(form);

    const decoded: any = JSON.parse(atob(res.token.split(".")[1]));
    router.refresh();
    
    if (decoded.role === "admin") {
      router.push("/admin/dashboard");
    } else if (decoded.role === "pegawai") {
      router.push("/pegawai/dashboard");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Login</h1>

      <input
        placeholder="Username"
        className="border p-2 w-full mb-2"
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />

      <input
        placeholder="Password"
        type="password"
        className="border p-2 w-full mb-2"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button
        onClick={onSubmit}
        className="bg-black text-white px-4 py-2 w-full"
      >
        {loading ? "Loading..." : "Login"}
      </button>
    </div>
  );
}