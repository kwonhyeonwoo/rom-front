import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import type { InquiryType } from "@/lib/support";

export type CreateInquiryBody = {
  type: InquiryType;
  title: string;
  content: string;
  // 비회원은 필수, 회원은 비우면 로그인 이메일로 답변을 받는다
  email?: string;
};

// 1:1 문의 보내기 (rom-back POST /inquiries). 비회원도 보낼 수 있다
export function useCreateInquiryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateInquiryBody) =>
      apiFetch<{ id: string; createdAt: string }>("/inquiries", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inquiries", "mine"] }),
  });
}
