import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import type { InquiryType } from "@/lib/support";

export type CreateInquiryBody = {
  type: InquiryType;
  title: string;
  content: string;
};

// 1:1 문의 보내기 (rom-back POST /inquiries). 로그인한 회원만 보낼 수 있다
export function useCreateInquiryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateInquiryBody) =>
      apiFetch<{ id: string; createdAt: string }>("/inquiries", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inquiries"] }),
  });
}
