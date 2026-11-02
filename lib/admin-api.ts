import { ApiError } from "@/lib/api";
import { clearAdminToken, getAdminToken } from "@/lib/admin-session";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// rom-back 관리자 API 호출. 관리자 토큰을 붙이고, 만료·거절(401)이면 토큰을 지워 로그인 화면으로 돌려보낸다
export async function adminFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const token = getAdminToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (res.status === 401 && path !== "/admin/login") clearAdminToken();
  if (!res.ok) throw new ApiError(res.status, await res.text());
  return res.json() as Promise<T>;
}
