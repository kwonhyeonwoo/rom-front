import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import type { NotificationList } from "@/lib/notifications";

export const notificationsKey = ["notifications"] as const;

// 헤더 벨 알림 목록과 안 읽은 개수 (rom-back GET /notifications). 로그인했을 때만 요청한다
export function useNotificationsQuery(enabled: boolean) {
  return useQuery({
    queryKey: notificationsKey,
    queryFn: () => apiFetch<NotificationList>("/notifications"),
    enabled,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}
