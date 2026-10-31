"use client";

import { useSession } from "@/hooks/useSession";
import { useVerificationQuery } from "@/hooks/queries/verification/useVerificationQuery";
import type { Verification, VerifyAccess } from "@/lib/verification";

// 지금 사용자의 면허 인증 상태. 글쓰기·댓글·후기 같은 쓰기 버튼이 이걸 보고 달라진다
export function useVerifyAccess(): {
  access: VerifyAccess;
  verification: Verification | undefined;
  viewer: string | null;
} {
  const session = useSession();
  const viewer = session ? session.user.id : null;
  const query = useVerificationQuery(viewer);

  if (session === undefined) return { access: "LOADING", verification: undefined, viewer };
  if (session === null) return { access: "GUEST", verification: undefined, viewer };
  if (!query.data) {
    // 상태를 못 가져오면(서버 오류) 쓰기를 막지는 않는다. 어차피 서버가 한 번 더 막는다
    return { access: query.status === "error" ? "NONE" : "LOADING", verification: undefined, viewer };
  }
  return { access: query.data.status, verification: query.data, viewer };
}
