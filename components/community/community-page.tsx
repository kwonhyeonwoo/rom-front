"use client";

import { useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MessageSquareText, PenLine } from "lucide-react";

import { Container } from "@/components/layout/container";
import { ListStatus } from "@/components/seminar/list-status";
import { usePostsQuery, type PostSort } from "@/hooks/queries/community/usePostsQuery";
import { useSession } from "@/hooks/useSession";
import { boards, type Board } from "@/lib/community";
import { cn } from "@/lib/utils";
import { pillClass } from "@/components/search/filter-pill";
import { CommunityLoginRequired, CommunitySkeleton } from "./login-required";
import { PostItem } from "./post-item";

const sorts: { value: PostSort; label: string }[] = [
  { value: "latest", label: "최신" },
  { value: "popular", label: "인기" },
];

// 게시판과 정렬은 주소(?board=&sort=)에 담아 새로고침·공유해도 유지한다
export function CommunityPage() {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const board = boards.find((b) => b.value === params.get("board"))?.value ?? null;
  const sort: PostSort = params.get("sort") === "popular" ? "popular" : "latest";
  const posts = usePostsQuery({ board, sort, enabled: Boolean(session) });

  const update = useCallback(
    (next: { board?: Board | null; sort?: PostSort }) => {
      const query = new URLSearchParams(params.toString());
      const nextBoard = next.board === undefined ? board : next.board;
      const nextSort = next.sort ?? sort;
      if (nextBoard) query.set("board", nextBoard);
      else query.delete("board");
      if (nextSort === "popular") query.set("sort", "popular");
      else query.delete("sort");
      const qs = query.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [board, sort, params, pathname, router],
  );

  if (session === undefined) return <CommunitySkeleton />;
  if (session === null) return <CommunityLoginRequired />;

  const items = posts.data?.pages.flatMap((page) => page.items) ?? [];
  const current = boards.find((b) => b.value === board);
  const writeHref = board ? `/community/write?board=${board}` : "/community/write";

  return (
    <Container className="max-w-[820px] pt-6 pb-12 md:pt-11">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[26px] font-extrabold tracking-[-0.045em] md:text-[30px]">커뮤니티</h1>
          <p className="mt-1.5 text-[14px] text-sub md:text-[14.5px]">{current?.hint ?? "동료 물리치료사들과 편하게 이야기해요"}</p>
        </div>
        <Link
          href={writeHref}
          className="hidden h-11 shrink-0 items-center gap-1.5 rounded-full bg-ink px-5 text-[14.5px] font-bold text-white md:inline-flex"
        >
          <PenLine size={16} strokeWidth={2.2} />
          글쓰기
        </Link>
      </div>

      <div className="-mx-5 mt-5 flex gap-1.5 overflow-x-auto px-5 pb-1 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
        <button type="button" data-on={board === null} onClick={() => update({ board: null })} className={pillClass}>
          전체
        </button>
        {boards.map((b) => (
          <button key={b.value} type="button" data-on={board === b.value} onClick={() => update({ board: b.value })} className={pillClass}>
            {b.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3 border-b border-ink pb-2 text-[13.5px] font-semibold">
        {sorts.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => update({ sort: s.value })}
            className={cn(sort === s.value ? "text-ink" : "text-faint hover:text-ink")}
          >
            {s.label}
          </button>
        ))}
      </div>

      {posts.status === "pending" ? (
        <div className="mt-4 space-y-3" aria-busy>
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="skeleton h-[104px] rounded-[14px]" />
          ))}
        </div>
      ) : posts.status === "error" ? (
        <ListStatus status="error" empty="" />
      ) : items.length === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-[20px] border border-dashed border-[#E4E4E4] px-6 py-14 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-surface">
            <MessageSquareText size={20} strokeWidth={2} />
          </span>
          <p className="mt-4 text-base font-bold">아직 올라온 글이 없어요</p>
          <p className="mt-1.5 text-[13.5px] text-sub">첫 글을 남겨보세요</p>
          <Link href={writeHref} className="mt-5 inline-flex h-10 items-center rounded-full bg-ink px-5 text-sm font-bold text-white">
            글쓰기
          </Link>
        </div>
      ) : (
        <>
          <div>
            {items.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </div>
          {posts.hasNextPage && (
            <button
              type="button"
              onClick={() => posts.fetchNextPage()}
              disabled={posts.isFetchingNextPage}
              className="mx-auto mt-6 flex h-11 items-center rounded-full border border-[#E4E4E4] px-6 text-sm font-semibold disabled:opacity-50"
            >
              {posts.isFetchingNextPage ? "불러오는 중" : "더 보기"}
            </button>
          )}
        </>
      )}

      {/* 모바일은 하단 탭바 위에 떠 있는 글쓰기 버튼 */}
      <Link
        href={writeHref}
        className="fixed right-5 bottom-[92px] z-30 inline-flex h-12 items-center gap-1.5 rounded-full bg-ink px-5 text-[15px] font-bold text-white shadow-[0_6px_20px_rgba(0,0,0,.22)] md:hidden"
      >
        <PenLine size={17} strokeWidth={2.2} />
        글쓰기
      </Link>
    </Container>
  );
}
