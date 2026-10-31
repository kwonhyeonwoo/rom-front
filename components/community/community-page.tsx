"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Heart,
  MessageCircle,
  MessageSquareText,
  PenLine,
  Search,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { pillClass } from "@/components/search/filter-pill";
import { ListStatus } from "@/components/seminar/list-status";
import {
  usePostsQuery,
  type PostSort,
} from "@/hooks/queries/community/usePostsQuery";
import { useUserQuery } from "@/hooks/queries/user/useUserQuery";
import { useSession } from "@/hooks/useSession";
import { boardLabel, boards, type Board, type Post } from "@/lib/community";
import { CommunityAside, CommunityNav } from "./community-side";
import { CommunityLoginRequired, CommunitySkeleton } from "./login-required";
import { BoardTag, PostItem } from "./post-item";

const sorts: { value: PostSort; label: string }[] = [
  { value: "latest", label: "최신" },
  { value: "popular", label: "인기" },
  { value: "comments", label: "댓글 많은" },
];

// 게시판·정렬·검색어·내 글은 주소(?board=&sort=&q=&mine=1)에 담아 새로고침·공유해도 유지한다
export function CommunityPage() {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { data: user } = useUserQuery(Boolean(session));

  const board =
    boards.find((b) => b.value === params.get("board"))?.value ?? null;
  const sortParam = params.get("sort");
  const sort: PostSort =
    sortParam === "popular" || sortParam === "comments" ? sortParam : "latest";
  const q = (params.get("q") ?? "").trim();
  const mine = params.get("mine") === "1";
  const filtered = board !== null || q !== "" || mine;

  const enabled = Boolean(session);
  const posts = usePostsQuery({ board, sort, q, mine, enabled });
  // 위쪽 인기 글 카드: 지금 인기 있는 글 3개 (필터가 없을 때만 보여준다)
  const hot = usePostsQuery({
    board: null,
    sort: "popular",
    limit: 3,
    enabled: enabled && !filtered,
  });

  const update = useCallback(
    (next: {
      board?: Board | null;
      sort?: PostSort;
      q?: string;
      mine?: boolean;
    }) => {
      const query = new URLSearchParams();
      const nextBoard = next.board === undefined ? board : next.board;
      const nextSort = next.sort ?? sort;
      const nextQ = next.q ?? q;
      const nextMine = next.mine ?? mine;
      if (nextBoard) query.set("board", nextBoard);
      if (nextSort !== "latest") query.set("sort", nextSort);
      if (nextQ) query.set("q", nextQ);
      if (nextMine) query.set("mine", "1");
      const qs = query.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [board, sort, q, mine, pathname, router],
  );

  if (session === undefined) return <CommunitySkeleton />;
  if (session === null) return <CommunityLoginRequired />;

  const items = posts.data?.pages.flatMap((page) => page.items) ?? [];
  const hotPosts = hot.data?.pages[0]?.items ?? [];
  const current = boards.find((b) => b.value === board);
  const writeHref = board
    ? `/community/write?board=${board}`
    : "/community/write";
  const name = user?.name ?? session.user.email?.split("@")[0] ?? "회원";

  return (
    <Container className="pt-6 pb-12 md:pt-11">
      <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)_300px] lg:items-start lg:gap-10">
        <div className="hidden lg:block">
          <CommunityNav
            view={{ board, sort, mine }}
            onSelect={(next) => update({ sort: "latest", q: "", ...next })}
          />
        </div>

        <div className="mx-auto w-full max-w-[820px] min-w-0 lg:max-w-none">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-[26px] font-extrabold tracking-[-0.045em] md:text-[30px]">
                커뮤니티
              </h1>
              <p className="mt-1.5 text-[14px] text-sub md:text-[14.5px]">
                {mine
                  ? "내가 쓴 글이에요"
                  : (current?.hint ?? "동료 물리치료사들과 편하게 이야기해요")}
              </p>
            </div>
            <Link
              href={writeHref}
              className="hidden h-11 shrink-0 items-center gap-1.5 rounded-full bg-ink px-5 text-[14.5px] font-bold text-white md:inline-flex lg:hidden"
            >
              <PenLine size={16} strokeWidth={2.2} />
              글쓰기
            </Link>
          </div>

          {/* 모바일·태블릿은 왼쪽 메뉴 대신 게시판 필 */}
          <div className="-mx-5 mt-5 flex gap-1.5 overflow-x-auto px-5 pb-1 md:mx-0 md:px-0 lg:hidden [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              data-on={board === null && !mine}
              onClick={() => update({ board: null, mine: false, q: "" })}
              className={pillClass}
            >
              전체
            </button>
            {boards.map((b) => (
              <button
                key={b.value}
                type="button"
                data-on={board === b.value && !mine}
                onClick={() => update({ board: b.value, mine: false, q: "" })}
                className={pillClass}
              >
                {b.label}
              </button>
            ))}
            <button
              type="button"
              data-on={mine}
              onClick={() => update({ board: null, mine: true, q: "" })}
              className={pillClass}
            >
              내가 쓴 글
            </button>
          </div>

          {!filtered && hotPosts.length > 0 && (
            <>
              <HotCards posts={hotPosts} />
              <HotBanner post={hotPosts[0]} />
            </>
          )}

          <div className="mt-6 flex items-center justify-between gap-3 border-b border-ink pb-2.5">
            <div className="flex min-w-0 gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {sorts.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  data-on={sort === s.value}
                  onClick={() => update({ sort: s.value })}
                  className={pillClass + " h-[34px] text-[13.5px]"}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <SearchBox
              key={q}
              value={q}
              onSearch={(value) => update({ q: value })}
            />
          </div>

          {posts.status === "pending" ? (
            <div className="mt-4 space-y-3" aria-busy>
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="skeleton h-[104px] rounded-[14px]"
                />
              ))}
            </div>
          ) : posts.status === "error" ? (
            <ListStatus status="error" empty="" />
          ) : items.length === 0 ? (
            <Empty search={q} mine={mine} writeHref={writeHref} />
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
        </div>

        <div className="hidden lg:block">
          <CommunityAside
            writeHref={writeHref}
            name={name}
            avatarUrl={user?.avatarUrl}
          />
        </div>
      </div>

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

// PC: 회색 카드 3개 (게시판 태그, 공감 수, 제목)
function HotCards({ posts }: { posts: Post[] }) {
  return (
    <div className="mt-6 hidden gap-3 md:grid md:grid-cols-3">
      {posts.slice(0, 3).map((post) => (
        <Link
          key={post.id}
          href={`/community/${post.id}`}
          className="block rounded-[16px] bg-surface p-5 transition-colors hover:bg-[#ECECE9]"
        >
          <div className="flex items-center justify-between">
            <BoardTag board={post.board} className="bg-white" />
            <span className="flex items-center gap-1 text-xs text-faint">
              <Heart size={13} strokeWidth={1.8} />
              {post.likeCount}
            </span>
          </div>
          <h3 className="mt-2.5 line-clamp-2 text-[15px] leading-[1.4] font-bold tracking-[-0.03em]">
            {post.title}
          </h3>
        </Link>
      ))}
    </div>
  );
}

// 모바일: 짙은 초록 "이번 주 인기" 카드 한 장
function HotBanner({ post }: { post: Post }) {
  return (
    <Link
      href={`/community/${post.id}`}
      className="mt-4 block rounded-[14px] bg-[#0E3B34] px-4 py-3.5 text-white md:hidden"
    >
      <p className="text-[11px] font-bold tracking-[.1em] text-[#8FE3C8]">
        이번 주 인기
      </p>
      <p className="mt-1 truncate text-[15px] font-bold">{post.title}</p>
      <p className="mt-0.5 flex items-center gap-2.5 text-xs opacity-70">
        <span className="flex items-center gap-1">
          <MessageCircle size={12} />
          댓글 {post.commentCount}
        </span>
        <span className="flex items-center gap-1">
          <Heart size={12} />
          공감 {post.likeCount}
        </span>
        <span>{boardLabel(post.board)}</span>
      </p>
    </Link>
  );
}

function SearchBox({
  value,
  onSearch,
}: {
  value: string;
  onSearch: (value: string) => void;
}) {
  const [text, setText] = useState(value);
  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(text.trim());
      }}
      className="hidden h-[38px] w-[220px] shrink-0 items-center gap-1.5 rounded-full border border-[#E4E4E4] px-3.5 focus-within:border-ink md:flex"
    >
      <Search size={16} className="shrink-0 text-sub" />
      <input
        value={text}
        onChange={(event) => setText(event.target.value)}
        aria-label="커뮤니티 검색"
        placeholder="커뮤니티 검색"
        maxLength={50}
        className="min-w-0 flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-faint"
      />
    </form>
  );
}

function Empty({
  search,
  mine,
  writeHref,
}: {
  search: string;
  mine: boolean;
  writeHref: string;
}) {
  return (
    <div className="mt-6 flex flex-col items-center rounded-[20px] border border-dashed border-[#E4E4E4] px-6 py-14 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-surface">
        <MessageSquareText size={20} strokeWidth={2} />
      </span>
      <p className="mt-4 text-base font-bold">
        {search
          ? `"${search}"에 맞는 글이 없어요`
          : mine
            ? "아직 쓴 글이 없어요"
            : "아직 올라온 글이 없어요"}
      </p>
      <p className="mt-1.5 text-[13.5px] text-sub">
        {search ? "다른 검색어로 찾아보세요" : "첫 글을 남겨보세요"}
      </p>
      {!search && (
        <Link
          href={writeHref}
          className="mt-5 inline-flex h-10 items-center rounded-full bg-ink px-5 text-sm font-bold text-white"
        >
          글쓰기
        </Link>
      )}
    </div>
  );
}
