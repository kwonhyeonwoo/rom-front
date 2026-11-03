import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import type { Inquiry } from "@/lib/support";

// 내 1:1 문의 내역 (rom-back GET /inquiries/mine). 로그인했을 때만 요청한다
export function useMyInquiriesQuery(enabled: boolean) {
  return useQuery({
    queryKey: ["inquiries", "mine"],
    queryFn: () => apiFetch<Inquiry[]>("/inquiries/mine"),
    enabled,
  });
}
