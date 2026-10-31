"use client";

import Link from "next/link";
import { PenLine, Star } from "lucide-react";

import { WriteButton } from "@/components/verification/write-button";
import { SeminarPoster } from "@/components/seminar/seminar-poster";
import { UserAvatar } from "@/components/layout/user-avatar";
import { useCommunitySummaryQuery } from "@/hooks/queries/community/useCommunitySummaryQuery";
import { boards, type Board } from "@/lib/community";
import type { Poster } from "@/lib/seminars";
import { cn } from "@/lib/utils";

export type CommunityView = {
  board: Board | null;
  sort: string;
  mine: boolean;
};

// PC 왼쪽 메뉴: 전체·인기, 게시판, 내가 쓴 글
export function CommunityNav({
  view,
  onSelect,
}: {
  view: CommunityView;
  onSelect: (
    next: Partial<{
      board: Board | null;
      sort: "latest" | "popular";
      mine: boolean;
    }>,
  ) => void;
}) {
  const none = view.board === null && !view.mine;
  const item = (active: boolean) =>
    cn(
      "flex w-full items-center rounded-lg px-3 py-2.5 text-left text-[14.5px]",
      active
        ? "bg-surface font-bold"
        : "font-medium text-[#444] hover:bg-surface/60",
    );

  return (
    <nav aria-label="게시판" className="sticky top-6 text-[14.5px]">
      <button
        type="button"
        className={item(none && view.sort !== "popular")}
        onClick={() => onSelect({ board: null, sort: "latest", mine: false })}
      >
        전체
      </button>
      <button
        type="button"
        className={item(none && view.sort === "popular")}
        onClick={() => onSelect({ board: null, sort: "popular", mine: false })}
      >
        인기
        <span className="ml-1.5 inline-flex h-[18px] items-center rounded bg-[#FDECEA] px-1.5 text-[10.5px] font-bold text-soon">
          HOT
        </span>
      </button>

      <p className="mt-5 mb-1.5 px-3 text-xs font-bold text-faint">게시판</p>
      {boards.map((b) => (
        <button
          key={b.value}
          type="button"
          className={item(view.board === b.value && !view.mine)}
          onClick={() => onSelect({ board: b.value, mine: false })}
        >
          {b.label}
        </button>
      ))}

      <div className="mt-6 border-t border-line pt-4">
        <button
          type="button"
          className={cn(item(view.mine), "text-[13px]")}
          onClick={() => onSelect({ board: null, mine: true })}
        >
          내가 쓴 글
        </button>
      </div>
    </nav>
  );
}

// PC 오른쪽 패널: 내 정보와 글쓰기, 후기가 많은 세미나, 커뮤니티 약속
export function CommunityAside({
  writeHref,
  user,
}: {
  writeHref: string;
  // 비회원이면 null. 내 활동 대신 로그인 안내를 보여준다
  user: { name: string; avatarUrl?: string | null } | null;
}) {
  const { data: summary } = useCommunitySummaryQuery(user !== null);

  return (
    <aside className="sticky top-6 flex flex-col gap-4">
      {user === null ? (
        <div className="rounded-[20px] border border-[#EFEFEF] p-5">
          <b className="text-[15px]">동료들과 이야기해보세요</b>
          <p className="mt-1.5 text-[13px] leading-[1.6] text-sub">
            로그인하고 면허를 인증하면 글과 댓글을 쓸 수 있어요.
          </p>
          <Link
            href="/login"
            className="mt-4 flex h-11 items-center justify-center rounded-full bg-ink text-[14.5px] font-bold text-white"
          >
            로그인
          </Link>
        </div>
      ) : (
      <div className="rounded-[20px] border border-[#EFEFEF] p-5">
        <div className="flex items-center gap-2.5">
          <UserAvatar name={user.name} src={user.avatarUrl} className="size-10" />
          <p className="min-w-0 truncate text-[15px] font-bold">{user.name}님</p>
        </div>
        <div className="mt-4 grid grid-cols-2 text-center text-[13px] text-sub">
          <div>
            <b className="block text-base text-ink">
              {summary?.myPostCount ?? "-"}
            </b>
            내 글
          </div>
          <div>
            <b className="block text-base text-ink">
              {summary?.myCommentCount ?? "-"}
            </b>
            댓글
          </div>
        </div>
        <WriteButton
          href={writeHref}
          className="mt-4 flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-ink text-[14.5px] font-bold text-white"
        >
          <PenLine size={16} strokeWidth={2.2} />
          글쓰기
        </WriteButton>
      </div>
      )}

      <div className="rounded-[20px] border border-[#EFEFEF] p-5">
        <div className="flex items-baseline justify-between">
          <b className="text-[15px]">후기 많은 세미나</b>
        </div>
        {summary && summary.topSeminars.length === 0 ? (
          <p className="mt-3 text-[13px] leading-[1.6] text-sub">
            세미나가 끝난 뒤 후기를 남기면 여기에 모여요.
          </p>
        ) : (
          <ul className="mt-2">
            {(summary?.topSeminars ?? []).map((s) => {
              const poster: Poster = {
                label: (s.host ?? "SEMINAR").slice(0, 16),
                lines: ["SEMINAR", "COURSE"],
                subtitle: s.title.slice(0, 12),
                date: "",
                theme: "navy",
              };
              return (
                <li key={s.id} className="flex items-center gap-3 py-2.5">
                  <div className="shrink-0 overflow-hidden rounded-md">
                    <SeminarPoster poster={poster} width={44} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-bold">{s.title}</p>
                    <p className="flex items-center gap-1.5 text-[12.5px] text-sub">
                      {s.avgRating !== null && (
                        <span className="flex items-center gap-0.5 font-bold text-[#E3A008]">
                          <Star
                            size={12}
                            className="fill-[#E3A008]"
                            strokeWidth={0}
                          />
                          {s.avgRating.toFixed(1)}
                        </span>
                      )}
                      후기 {s.reviewCount}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="rounded-[20px] bg-surface p-5 text-[13px] leading-[1.7]">
        <b className="text-sm">커뮤니티 약속</b>
        <ul className="mt-1.5 text-sub">
          <li>· 환자 이름·얼굴·차트는 올리지 않아요</li>
          <li>· 특정 업체 홍보는 표시된 광고로만</li>
          <li>· 익명이어도 같은 동료예요. 서로 존중해요</li>
        </ul>
      </div>
    </aside>
  );
}
