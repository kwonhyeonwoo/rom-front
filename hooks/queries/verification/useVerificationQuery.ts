import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import type { Verification } from "@/lib/verification";

export const verificationKey = (viewer: string) => ["verification", viewer] as const;

// 내 면허 인증 상태 (rom-back GET /verification/me). 로그인 상태일 때만 요청한다
export function useVerificationQuery(viewer: string | null) {
  return useQuery({
    queryKey: verificationKey(viewer ?? "guest"),
    queryFn: () => apiFetch<Verification>("/verification/me"),
    enabled: viewer !== null,
  });
}
