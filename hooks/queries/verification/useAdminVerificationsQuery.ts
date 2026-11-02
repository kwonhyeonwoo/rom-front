import { useQuery } from "@tanstack/react-query";

import type { AdminVerificationItem, ReviewStatus } from "@/lib/admin-verification";
import { apiFetch } from "@/lib/api";

export const adminVerificationsKey = (status: ReviewStatus) => ["admin-verifications", "list", status] as const;

// 면허 인증 요청 목록 (rom-back GET /admin/verifications). 관리자가 아니면 403
export function useAdminVerificationsQuery(status: ReviewStatus, enabled: boolean) {
  return useQuery({
    queryKey: adminVerificationsKey(status),
    queryFn: () => apiFetch<AdminVerificationItem[]>(`/admin/verifications?status=${status}`),
    enabled,
    // 권한 없음(403)은 다시 시도해도 같다
    retry: (count, error) => !("status" in error && error.status === 403) && count < 1,
  });
}
