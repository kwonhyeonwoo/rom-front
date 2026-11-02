import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ReviewStatus } from "@/lib/admin-verification";
import { adminFetch } from "@/lib/admin-api";

export type ReviewDecision = { id: string; action: "approve" } | { id: string; action: "reject"; reason: string };

// 면허 인증 승인·반려 (rom-back POST /admin/verifications/:id/approve | reject)
export function useReviewVerificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (decision: ReviewDecision) =>
      adminFetch<{ id: string; status: ReviewStatus }>(`/admin/verifications/${decision.id}/${decision.action}`, {
        method: "POST",
        body: decision.action === "reject" ? JSON.stringify({ reason: decision.reason }) : undefined,
      }),
    // 이미 처리된 요청(409)이어도 목록을 새로 받아 화면을 맞춘다
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["admin-verifications"] }),
  });
}
