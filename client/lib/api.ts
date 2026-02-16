const BASE_URL = "http://localhost:5000";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include", // 🔥 WAJIB untuk cookie
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Request gagal");
  }

  return res.json();
}
