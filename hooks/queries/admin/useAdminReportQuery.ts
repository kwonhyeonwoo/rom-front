import { useQuery } from "@tanstack/react-query";

import { adminFetch } from "@/lib/admin-api";
import type { AdminReportDetail, ReportTarget } from "@/lib/report";

// 신고 상세 (rom-back GET /admin/reports/:type/:id): 대상 내용, 신고자·작성자 계정, 누적 신고와 제재
export function useAdminReportQuery(type: ReportTarget, id: string) {
  return useQuery({
    queryKey: ["admin", "report", type, id],
    queryFn: () => adminFetch<AdminReportDetail>(`/admin/reports/${type}/${encodeURIComponent(id)}`),
    retry: (count, error) => !("status" in error && error.status === 401) && count < 1,
  });
}
