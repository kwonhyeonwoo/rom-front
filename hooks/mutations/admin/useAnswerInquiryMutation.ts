import { useMutation, useQueryClient } from "@tanstack/react-query";

import { adminFetch } from "@/lib/admin-api";
import type { AdminInquiry } from "@/lib/support";

// 1:1 문의 답변 (rom-back POST /admin/inquiries/:id/answer). 답변하면 목록과 배지를 새로 받는다
export function useAnswerInquiryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, answer }: { id: string; answer: string }) =>
      adminFetch<AdminInquiry>(`/admin/inquiries/${id}/answer`, {
        method: "POST",
        body: JSON.stringify({ answer }),
      }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["admin"] }),
  });
}
