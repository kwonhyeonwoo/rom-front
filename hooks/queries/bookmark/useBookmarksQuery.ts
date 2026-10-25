import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { toSeminar, type ApiSeminar } from "@/lib/seminars";

// 마이페이지 저장 목록 (rom-back GET /bookmarks). 최근 저장순
export function useBookmarksQuery(enabled: boolean) {
  return useQuery({
    queryKey: ["bookmark", "list"],
    queryFn: () => apiFetch<{ items: (ApiSeminar & { bookmarkedAt: string })[] }>("/bookmarks"),
    select: (data) => data.items.map(toSeminar),
    enabled,
  });
}
