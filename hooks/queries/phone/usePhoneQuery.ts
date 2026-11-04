import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import type { MyPhone } from "@/lib/phone";

export const phoneKey = (viewer: string) => ["phone", viewer] as const;

// 내 휴대폰번호 (rom-back GET /phone/me). 가린 번호만 온다. 로그인 상태일 때만 요청한다
export function usePhoneQuery(viewer: string | null) {
  return useQuery({
    queryKey: phoneKey(viewer ?? "guest"),
    queryFn: async () => (await apiFetch<{ phone: MyPhone | null }>("/phone/me")).phone,
    enabled: viewer !== null,
  });
}
