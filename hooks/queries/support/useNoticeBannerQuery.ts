import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import type { NoticeItem } from "@/lib/support";

// 메인 상단 띠 배너에 띄울 가장 최근 고정 공지 (rom-back GET /notices/banner). 없으면 null
export function useNoticeBannerQuery() {
  return useQuery({
    queryKey: ["notices", "banner"],
    queryFn: () => apiFetch<{ notice: Omit<NoticeItem, "pinned"> | null }>("/notices/banner").then((r) => r.notice),
    staleTime: 5 * 60_000,
  });
}
