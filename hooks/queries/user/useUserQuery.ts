import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

export type User = {
  id: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
  provider: string | null;
};

// 내 정보 조회 (rom-back GET /auth/me). 로그인 상태일 때만 요청한다.
export function useUserQuery(enabled: boolean) {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: () => apiFetch<User>("/auth/me"),
    enabled,
  });
}
