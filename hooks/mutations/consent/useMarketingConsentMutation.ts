import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { CONSENT_VERSION, type MyConsents } from "@/lib/consent";

// 마케팅 정보 수신 동의·철회 (rom-back PUT /consents/marketing)
export function useMarketingConsentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (agreed: boolean) =>
      apiFetch<MyConsents>("/consents/marketing", {
        method: "PUT",
        body: JSON.stringify({ agreed, version: CONSENT_VERSION }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["consents"] }),
  });
}
