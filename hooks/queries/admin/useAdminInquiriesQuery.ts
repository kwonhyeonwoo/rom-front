import { useQuery } from "@tanstack/react-query";

import { adminFetch } from "@/lib/admin-api";
import type { AdminInquiry, InquiryStatus } from "@/lib/support";

// 1:1 문의 목록 (rom-back GET /admin/inquiries). 대기는 오래된 것부터
export function useAdminInquiriesQuery(status: InquiryStatus) {
  return useQuery({
    queryKey: ["admin", "inquiries", status],
    queryFn: () => adminFetch<AdminInquiry[]>(`/admin/inquiries?status=${status}`),
    retry: (count, error) => !("status" in error && error.status === 401) && count < 1,
  });
}
