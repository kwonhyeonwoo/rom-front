import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import type { CommunitySummary } from "@/lib/community";

// 커뮤니티 우측 패널: 내 활동 수, 후기가 많은 세미나 (rom-back GET /community/summary)
export function useCommunitySummaryQuery(enabled: boolean) {
  return useQuery({
    queryKey: ["community", "summary"],
    queryFn: () => apiFetch<CommunitySummary>("/community/summary"),
    enabled,
  });
}
