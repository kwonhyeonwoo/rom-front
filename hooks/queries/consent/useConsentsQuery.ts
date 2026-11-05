import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import type { MyConsents } from "@/lib/consent";

export const consentsKey = (viewer: string) => ["consents", viewer] as const;

// 내 동의 상태 (rom-back GET /consents/me). 로그인 상태일 때만 요청한다
export function useConsentsQuery(viewer: string | null) {
  return useQuery({
    queryKey: consentsKey(viewer ?? "guest"),
    queryFn: () => apiFetch<MyConsents>("/consents/me"),
    enabled: viewer !== null,
  });
}
