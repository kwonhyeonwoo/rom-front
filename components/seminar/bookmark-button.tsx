"use client";

import { Bookmark } from "lucide-react";

import { useBookmarkStore } from "@/stores/use-bookmark-store";
import { cn } from "@/lib/utils";

export function BookmarkButton({ seminarId, className }: { seminarId: string; className?: string }) {
  const saved = useBookmarkStore((state) => state.ids.includes(seminarId));
  const toggle = useBookmarkStore((state) => state.toggle);

  return (
    <button
      type="button"
      aria-label={saved ? "저장 취소" : "저장"}
      aria-pressed={saved}
      onClick={() => toggle(seminarId)}
      className={cn(
        "flex size-[30px] items-center justify-center rounded-full bg-white/92 text-[#555] transition-colors hover:text-ink",
        className,
      )}
    >
      <Bookmark size={15} strokeWidth={2} className={cn(saved && "fill-ink text-ink")} />
    </button>
  );
}
