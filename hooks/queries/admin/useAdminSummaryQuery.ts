import { useQuery } from "@tanstack/react-query";

import { adminFetch } from "@/lib/admin-api";
import type { AdminSummary } from "@/lib/support";

export const adminSummaryKey = ["admin", "summary"] as const;

// 관리자 사이드바 배지: 대기 중인 면허 인증과 답변 안 한 문의 수 (rom-back GET /admin/summary)
export function useAdminSummaryQuery(enabled: boolean) {
  return useQuery({
    queryKey: adminSummaryKey,
    queryFn: () => adminFetch<AdminSummary>("/admin/summary"),
    enabled,
    refetchInterval: 60_000,
    retry: (count, error) => !("status" in error && error.status === 401) && count < 1,
  });
}
