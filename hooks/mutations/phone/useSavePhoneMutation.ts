import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import type { MyPhone } from "@/lib/phone";

// 휴대폰번호 직접 입력 (rom-back PUT /phone). 지금은 형식만 확인한다.
// 문자 인증을 붙이면 이 앞에 "인증번호 받기 → 확인" 단계가 들어간다
export function useSavePhoneMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (phone: string) =>
      (await apiFetch<{ phone: MyPhone }>("/phone", { method: "PUT", body: JSON.stringify({ phone }) })).phone,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["phone"] }),
  });
}
