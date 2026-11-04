import { useQuery } from "@tanstack/react-query";

import { adminFetch } from "@/lib/admin-api";
import type { AdminReportGroup, ReportFilter } from "@/lib/report";

// 신고 목록 (rom-back GET /admin/reports). 같은 글·댓글에 들어온 신고는 한 줄로 묶여 온다
export function useAdminReportsQuery(status: ReportFilter) {
  return useQuery({
    queryKey: ["admin", "reports", status],
    queryFn: () => adminFetch<AdminReportGroup[]>(`/admin/reports?status=${status}`),
    retry: (count, error) => !("status" in error && error.status === 401) && count < 1,
  });
}
