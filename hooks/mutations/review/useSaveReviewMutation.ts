import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import type { Review } from "@/lib/reviews";

// 후기 등록·수정 (PUT /reviews/:seminarId). 커뮤니티 세미나 후기 글도 함께 만들거나 고친다
export function useSaveReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      seminarId,
      ...body
    }: {
      seminarId: string;
      rating: number;
      content: string;
      title: string;
      anonymous: boolean;
    }) =>
      apiFetch<Review>(`/reviews/${encodeURIComponent(seminarId)}`, { method: "PUT", body: JSON.stringify(body) }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["bookmark"] }),
        queryClient.invalidateQueries({ queryKey: ["community"] }),
      ]),
  });
}
