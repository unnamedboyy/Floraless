export async function apiFetch(url: string, options: RequestInit = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL belum diset");
  }

  const fullUrl =
    `${baseUrl.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;

  const res = await fetch(fullUrl, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    let errorMessage = "Request gagal";

    try {
      const errorData = await res.json();
      errorMessage = errorData?.message || errorMessage;
    } catch {}

    if (res.status !== 401) {
      console.error("API ERROR:", {
        fullUrl,
        status: res.status,
        message: errorMessage,
      });
    }

    throw new Error(errorMessage);
  }

  return res.json();
}