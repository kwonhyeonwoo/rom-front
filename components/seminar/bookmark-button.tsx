"use client";

import { Bookmark } from "lucide-react";

import { useToggleBookmarkMutation } from "@/hooks/mutations/bookmark/useToggleBookmarkMutation";
import { useBookmarkIdsQuery } from "@/hooks/queries/bookmark/useBookmarkIdsQuery";
import { ApiError, apiErrorMessage } from "@/lib/api";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "@/stores/use-toast-store";

const LOGIN_ACTION = { label: "로그인", href: "/login" };

export function BookmarkButton({
  seminarId,
  variant = "overlay",
  className,
}: {
  seminarId: string;
  // overlay: 포스터 위 흰 원형 버튼, plain: 목록 아이템 옆 아이콘만
  variant?: "overlay" | "plain";
  className?: string;
}) {
  const { data: ids } = useBookmarkIdsQuery();
  const toggle = useToggleBookmarkMutation();
  const saved = ids?.includes(seminarId) ?? false;

  async function handleClick() {
    const { data } = await getSupabaseBrowserClient().auth.getSession();
    if (!data.session) {
      toast("로그인하고 관심 세미나를 저장해보세요", LOGIN_ACTION);
      return;
    }
    const save = !saved;
    toggle.mutate(
      { seminarId, save },
      {
        onSuccess: () =>
          toast(save ? "북마크에 저장했어요" : "북마크에서 뺐어요", save ? { label: "보기", href: "/mypage" } : undefined),
        onError: (error) =>
          error instanceof ApiError && error.status === 401
            ? toast("로그인이 만료됐어요. 다시 로그인해주세요", LOGIN_ACTION)
            : error instanceof ApiError && error.status === 409
              ? toast(apiErrorMessage(error, "저장을 뺄 수 없어요"))
              : toast("저장하지 못했어요. 잠시 후 다시 시도해주세요"),
      },
    );
  }

  return (
    <button
      type="button"
      aria-label={saved ? "북마크 취소" : "북마크 저장"}
      aria-pressed={saved}
      onClick={handleClick}
      className={cn(
        "flex items-center justify-center rounded-full transition-colors",
        variant === "overlay"
          ? "size-[30px] bg-white/92 text-[#555] hover:text-ink"
          : "size-8 text-[#9A9A9A] hover:bg-surface hover:text-ink",
        className,
      )}
    >
      <Bookmark
        size={variant === "overlay" ? 15 : 18}
        strokeWidth={2}
        className={cn(saved && "fill-ink text-ink")}
      />
    </button>
  );
}
