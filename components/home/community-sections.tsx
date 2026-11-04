"use client";

import { useState } from "react";
import Link from "next/link";
import { Flame, Heart, MessageCircle, PenLine, Star } from "lucide-react";

import { SeminarPoster } from "@/components/seminar/seminar-poster";
import { BoardTag } from "@/components/community/post-item";
import { EventTag, OperatorBadge } from "@/components/community/post-badges";
import { WriteButton } from "@/components/verification/write-button";
import { useCommunitySummaryQuery } from "@/hooks/queries/community/useCommunitySummaryQuery";
import { usePostsQuery } from "@/hooks/queries/community/usePostsQuery";
import { useSession } from "@/hooks/useSession";
import { boards, plainContent, timeAgo, type Board, type Post } from "@/lib/community";
import type { Poster } from "@/lib/seminars";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./section-header";

function Stats({ post }: { post: Post }) {
  return (
    <span className="flex items-center gap-2.5 text-xs text-faint">
      <span className="flex items-center gap-1">
        <Heart size={13} strokeWidth={1.8} />
        {post.likeCount}
      </span>
      <span className="flex items-center gap-1">
        <MessageCircle size={13} strokeWidth={1.8} />
        {post.commentCount}
      </span>
    </span>
  );
}

// 커뮤니티 인기글 TOP5 (보수교육 목록 옆 박스)
export function HotPostsBox() {
  const session = useSession();
  const viewer = session ? session.user.id : "guest";
  const { data, status } = usePostsQuery({
    board: null,
    sort: "popular",
    limit: 5,
    viewer,
    enabled: session !== undefined,
  });
  const posts = data?.pages[0]?.items ?? [];

  return (
    <section className="rounded-[18px] border border-[#EFEFEF] px-[18px] pt-[18px] pb-2 md:px-[22px] md:pt-[22px]">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-[17px] font-extrabold tracking-[-0.03em] md:text-lg">
          <Flame size={18} strokeWidth={2} className="text-soon" />
          커뮤니티 인기글
        </h2>
        <Link href="/community?sort=popular" className="text-[12.5px] font-semibold text-sub hover:text-ink">
          더보기 ›
        </Link>
      </div>

      {status === "pending" ? (
        <div className="mt-3 space-y-3 pb-3" aria-busy>
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="skeleton h-10 rounded-lg" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="py-8 text-center text-[13px] text-sub">아직 인기글이 없어요.</p>
      ) : (
        <ol className="mt-1">
          {posts.map((post, index) => (
            <li key={post.id} className={cn(index > 0 && "border-t border-[#F3F3F3]")}>
              <Link href={`/community/${post.id}`} className="flex items-center gap-3.5 py-3 hover:opacity-80">
                <span className={cn("w-[18px] text-base font-extrabold", index < 3 ? "text-brand" : "text-[#B5B5B5]")}>
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold md:text-[14.5px]">{post.title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-faint">{boards.find((b) => b.value === post.board)?.label}</span>
                    <Stats post={post} />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

// 게시판 탭이 달린 커뮤니티 최신글
export function LatestPostsSection() {
  const session = useSession();
  const viewer = session ? session.user.id : "guest";
  const [board, setBoard] = useState<Board | null>(null);
  const { data, status } = usePostsQuery({
    board,
    sort: "latest",
    limit: 4,
    viewer,
    enabled: session !== undefined,
  });
  const posts = (data?.pages[0]?.items ?? []).slice(0, 4);
  const tabs: { value: Board | null; label: string }[] = [{ value: null, label: "전체" }, ...boards];

  return (
    <section className="min-w-0">
      <SectionHeader
        title="커뮤니티 최신글"
        description="동료 물리치료사들의 이야기"
        href={board ? `/community?board=${board}` : "/community"}
        linkLabel="커뮤니티 가기 ›"
      />
      <div role="tablist" aria-label="게시판" className="flex gap-[18px] overflow-x-auto border-b border-[#EFEFEF] md:gap-[22px] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            type="button"
            role="tab"
            aria-selected={board === tab.value}
            onClick={() => setBoard(tab.value)}
            className={cn(
              "shrink-0 pb-3 text-sm font-semibold whitespace-nowrap md:text-[15px]",
              board === tab.value ? "text-ink shadow-[inset_0_-2px_0_var(--color-ink)]" : "text-[#9A9A9A] hover:text-ink",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {status === "pending" ? (
        <div className="mt-4 space-y-3" aria-busy>
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="skeleton h-[84px] rounded-[14px]" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="py-12 text-center text-sm text-sub">
          {status === "error" ? "글을 불러오지 못했어요." : "아직 올라온 글이 없어요."}
        </p>
      ) : (
        <>
          <div>
            {posts.map((post) => (
              <article key={post.id} className="border-b border-[#F0F0F0] last:border-b-0">
                <Link href={`/community/${post.id}`} className="block py-4 md:py-[18px]">
                  <div className="flex items-center gap-2">
                    <BoardTag board={post.board} />
                    <h3 className="truncate text-[15px] font-bold tracking-[-0.03em] md:text-base">{post.title}</h3>
                  </div>
                  <p className="mt-1.5 truncate text-[13px] text-sub md:text-sm">{plainContent(post.content)}</p>
                  <div className="mt-2 flex items-center justify-between gap-3 text-xs">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <b className="font-semibold text-[#333]">{post.authorName}</b>
                      {post.byOperator && <OperatorBadge />}
                      {post.eventEntry && <EventTag />}
                      <span className="text-faint">· {timeAgo(post.createdAt)}</span>
                    </span>
                    <Stats post={post} />
                  </div>
                </Link>
              </article>
            ))}
          </div>
          <div className="mt-2 flex justify-center">
            <WriteButton
              href={board ? `/community/write?board=${board}` : "/community/write"}
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#DEDEDE] px-5 text-sm font-semibold"
            >
              <PenLine size={15} />
              글쓰기
            </WriteButton>
          </div>
        </>
      )}
    </section>
  );
}

// 후기가 많은 세미나 (rom-back /community/summary는 로그인한 회원에게만 내려준다)
export function TopReviewedSeminars() {
  const session = useSession();
  const { data: summary } = useCommunitySummaryQuery(Boolean(session));
  const seminars = summary?.topSeminars ?? [];

  return (
    <section className="rounded-[18px] border border-[#EFEFEF] p-[18px] md:p-[22px]">
      <h2 className="text-[17px] font-extrabold tracking-[-0.03em] md:text-lg">후기 많은 세미나</h2>
      {session === null ? (
        <p className="mt-3 text-[13px] leading-[1.6] text-sub">
          로그인하면 후기가 많은 세미나를 볼 수 있어요.{" "}
          <Link href="/login" className="font-semibold text-brand">
            로그인 ›
          </Link>
        </p>
      ) : seminars.length === 0 ? (
        <p className="mt-3 text-[13px] leading-[1.6] text-sub">세미나가 끝난 뒤 후기를 남기면 여기에 모여요.</p>
      ) : (
        <ul className="mt-3 space-y-3.5">
          {seminars.map((s) => {
            const poster: Poster = {
              label: (s.host ?? "SEMINAR").slice(0, 16),
              lines: ["SEMINAR", "COURSE"],
              subtitle: s.title.slice(0, 12),
              date: "",
              theme: "navy",
            };
            return (
              <li key={s.id}>
                <Link href={`/community?board=REVIEW&q=${encodeURIComponent(s.title)}`} className="flex items-center gap-3.5 hover:opacity-80">
                  <div className="shrink-0 overflow-hidden rounded-md">
                    <SeminarPoster poster={poster} width={44} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{s.title}</p>
                    <p className="flex items-center gap-1.5 text-[12.5px] text-sub">
                      {s.avgRating !== null && (
                        <span className="flex items-center gap-0.5 font-bold text-[#E3A008]">
                          <Star size={12} className="fill-[#E3A008]" strokeWidth={0} />
                          {s.avgRating.toFixed(1)}
                        </span>
                      )}
                      후기 {s.reviewCount}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
