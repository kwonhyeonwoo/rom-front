import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { PAGE_SIZE, toApiQuery, type SearchFilters } from "@/lib/search";
import { toSeminar, type SeminarPage } from "@/lib/seminars";

// 세미나 목록·검색 (rom-back GET /seminars). 필터를 바꾸는 동안에는 이전 결과를 유지한다.
export function useSeminarsQuery(filters: SearchFilters, limit = PAGE_SIZE) {
  const query = toApiQuery(filters, limit);
  return useQuery({
    queryKey: ["seminar", "list", query],
    queryFn: () => apiFetch<SeminarPage>(`/seminars?${query}`),
    select: (data) => ({
      ...data,
      items: data.items.map(toSeminar),
      totalPages: Math.max(1, Math.ceil(data.total / data.limit)),
    }),
    placeholderData: keepPreviousData,
  });
}
