import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { apiErrorMessage, apiFetch } from "@/lib/api";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { toast } from "@/stores/use-toast-store";

// 회원 탈퇴 (rom-back DELETE /account). 서버가 데이터와 로그인 계정을 지우면 이 기기의 세션도 정리한다
export function useWithdrawMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await apiFetch<void>("/account", { method: "DELETE" });
      // 계정이 이미 지워져 서버 로그아웃은 실패할 수 있으므로 이 기기에서만 세션을 지운다
      await getSupabaseBrowserClient().auth.signOut({ scope: "local" });
    },
    onSuccess: () => {
      queryClient.clear();
      toast("탈퇴가 완료됐어요. 그동안 이용해주셔서 감사합니다.");
      router.replace("/");
    },
    onError: (error) => toast(apiErrorMessage(error, "탈퇴하지 못했어요. 잠시 후 다시 시도해주세요.")),
  });
}
