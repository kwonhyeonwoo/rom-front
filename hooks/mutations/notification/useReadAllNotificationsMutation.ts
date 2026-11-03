import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { notificationsKey } from "@/hooks/queries/notification/useNotificationsQuery";

// 알림 모두 읽음 (rom-back POST /notifications/read-all)
export function useReadAllNotificationsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiFetch<{ ok: true }>("/notifications/read-all", { method: "POST" }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: notificationsKey }),
  });
}
