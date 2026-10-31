import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

// 후기 등록·수정 (PUT /reviews/:seminarId)
export function useSaveReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ seminarId, ...body }: { seminarId: string; rating: number; content: string }) =>
      apiFetch(`/reviews/${encodeURIComponent(seminarId)}`, { method: "PUT", body: JSON.stringify(body) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookmark"] }),
  });
}
