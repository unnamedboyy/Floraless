import { apiFetch } from "./api";

export async function logout() {
  await apiFetch("/api/auth/logout", {
    method: "POST",
  });
}
