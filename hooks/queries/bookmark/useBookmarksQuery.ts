import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { toSavedSeminar, type ApiSavedSeminar } from "@/lib/reviews";

export const bookmarkListKey = ["bookmark", "list"] as const;

// 마이페이지 저장 목록 (rom-back GET /bookmarks). 최근 저장순. 수강 여부와 내 후기도 함께 온다
export function useBookmarksQuery(enabled: boolean) {
  return useQuery({
    queryKey: bookmarkListKey,
    queryFn: () => apiFetch<{ items: ApiSavedSeminar[] }>("/bookmarks"),
    select: (data) => data.items.map(toSavedSeminar),
    enabled,
  });
}
