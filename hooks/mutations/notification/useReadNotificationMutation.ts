import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { notificationsKey } from "@/hooks/queries/notification/useNotificationsQuery";

// 알림 하나를 읽음 처리 (rom-back POST /notifications/:id/read)
export function useReadNotificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiFetch<{ ok: true }>(`/notifications/${id}/read`, { method: "POST" }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: notificationsKey }),
  });
}
