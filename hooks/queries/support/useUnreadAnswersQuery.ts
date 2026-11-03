import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

export const unreadAnswersKey = ["inquiries", "unread"] as const;

// 아직 열어보지 않은 문의 답변 수 (rom-back GET /inquiries/unread-count). 헤더·마이페이지의 "새 답변" 표시에 쓴다
export function useUnreadAnswersQuery(enabled: boolean) {
  return useQuery({
    queryKey: unreadAnswersKey,
    queryFn: () => apiFetch<{ count: number }>("/inquiries/unread-count").then((r) => r.count),
    enabled,
    staleTime: 30_000,
    refetchInterval: 120_000,
  });
}
