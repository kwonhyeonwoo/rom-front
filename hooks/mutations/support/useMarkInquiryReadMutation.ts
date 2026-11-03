import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

// 문의 답변을 열어봤다고 표시 (rom-back POST /inquiries/:id/read). 새 답변 표시가 줄어든다
export function useMarkInquiryReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiFetch<{ ok: true }>(`/inquiries/${id}/read`, { method: "POST" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inquiries"] }),
  });
}
