export async function apiFetch(url: string, options: RequestInit = {}) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const fullUrl = `${baseUrl.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;

  try {
    const res = await fetch(fullUrl, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    // baca response text dulu
    const text = await res.text();

    // convert ke json jika ada
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    // jika error dari server
    if (!res.ok) {
      throw new Error(data?.message || "Terjadi kesalahan server");
    }

    return data;
  } catch (err) {
    console.error("API FETCH ERROR:", err);
    throw err;
  }
}