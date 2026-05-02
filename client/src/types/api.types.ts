/**
 * types/api.types.ts
 * Type global yang dipakai di seluruh layer service & hooks.
 * Di-import dari sini, bukan dari lib/axios.ts langsung.
 */

export type { ApiResponse, PaginatedResponse } from "../lib/axios";
export type { Role, AuthUser, LoginResponse } from "../services/auth.service";