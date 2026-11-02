import { useQuery } from "@tanstack/react-query";

import type { AdminVerificationItem, ReviewStatus } from "@/lib/admin-verification";
import { adminFetch } from "@/lib/admin-api";

export const adminVerificationsKey = (status: ReviewStatus) => ["admin-verifications", "list", status] as const;

// 면허 인증 요청 목록 (rom-back GET /admin/verifications). 관리자 토큰이 없거나 만료면 401
export function useAdminVerificationsQuery(status: ReviewStatus, enabled: boolean) {
  return useQuery({
    queryKey: adminVerificationsKey(status),
    queryFn: () => adminFetch<AdminVerificationItem[]>(`/admin/verifications?status=${status}`),
    enabled,
    // 로그인이 풀린 경우(401)는 다시 시도해도 같다
    retry: (count, error) => !("status" in error && error.status === 401) && count < 1,
  });
}
