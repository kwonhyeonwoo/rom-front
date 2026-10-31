"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Heart, Link2, Lock, Trash2 } from "lucide-react";

import { Container } from "@/components/layout/container";
import { useAddCommentMutation } from "@/hooks/mutations/community/useAddCommentMutation";
import { useDeleteCommentMutation } from "@/hooks/mutations/community/useDeleteCommentMutation";
import { useDeletePostMutation } from "@/hooks/mutations/community/useDeletePostMutation";
import { useToggleLikeMutation } from "@/hooks/mutations/community/useToggleLikeMutation";
import { usePostQuery } from "@/hooks/queries/community/usePostQuery";
import { useSession } from "@/hooks/useSession";
import { useVerifyAccess } from "@/hooks/useVerifyAccess";
import { ApiError, apiErrorMessage } from "@/lib/api";
import {
  COMMENT_MAX,
  timeAgo,
  type PostComment,
  type PostDetail as PostDetailData,
} from "@/lib/community";
import { formatSchedule } from "@/lib/seminars";
import { isVerificationRequired, type VerifyAccess } from "@/lib/verification";
import { cn } from "@/lib/utils";
import { toast } from "@/stores/use-toast-store";
import { VerifyBanner } from "@/components/verification/verify-banner";
import { CommunitySkeleton } from "./login-required";
import { BoardTag } from "./post-item";

export function PostDetail({ postId }: { postId: string }) {
  const session = useSession();
  const viewer = session ? session.user.id : "guest";
  // 글 본문은 비회원도 읽는다. 세션 확인이 끝난 뒤에 요청해 토큰 없이 한 번 더 부르지 않는다
  const post = usePostQuery(postId, viewer, session !== undefined);

  if (session === undefined || post.status === "pending")
    return <CommunitySkeleton />;
  if (post.status === "error" || !post.data) {
    const missing = post.error instanceof ApiError && post.error.status === 404;
    return (
      <Container className="flex justify-center py-20 md:py-28">
        <div className="w-full max-w-[380px] text-center">
          <h1 className="text-xl font-extrabold tracking-[-0.04em]">
            {missing ? "글을 찾을 수 없어요" : "불러오지 못했어요"}
          </h1>
          <p className="mt-2 text-[15px] text-sub">
            {missing
              ? "삭제됐거나 없는 글이에요."
              : "잠시 후 다시 시도해주세요."}
          </p>
          <Link
            href="/community"
            className="mt-8 flex h-12 items-center justify-center rounded-full bg-ink text-[15px] font-bold text-white"
          >
            커뮤니티로 가기
          </Link>
        </div>
      </Container>
    );
  }

  return <PostView post={post.data} viewer={viewer} />;
}

function PostView({ post, viewer }: { post: PostDetailData; viewer: string }) {
  const router = useRouter();
  const { access, verification } = useVerifyAccess();
  const like = useToggleLikeMutation(post.id, viewer);
  const remove = useDeletePostMutation();
  const [confirming, setConfirming] = useState(false);

  function deletePost() {
    remove.mutate(post.id, {
      onSuccess: () => {
        toast("글을 삭제했어요");
        router.replace("/community");
      },
      onError: (error) =>
        toast(
          apiErrorMessage(
            error,
            "삭제하지 못했어요. 잠시 후 다시 시도해주세요",
          ),
        ),
    });
  }

  // 승인 전에는 공감을 누를 수 없다. 로그인·인증 화면으로 안내한다
  function toggleLike() {
    if (access === "APPROVED") return like.mutate(!post.liked);
    toast(
      access === "GUEST" ? "로그인하면 공감할 수 있어요" : "면허 인증 후 공감할 수 있어요",
      access === "GUEST"
        ? { label: "로그인", href: "/login" }
        : access === "PENDING"
          ? undefined
          : { label: "인증하기", href: "/verify" },
    );
  }

  return (
    <Container className="max-w-[720px] pt-4 pb-12 md:pt-9">
      <Link
        href="/community"
        className="inline-flex items-center gap-0.5 text-[13.5px] font-semibold text-sub hover:text-ink"
      >
        <ChevronLeft size={16} />
        커뮤니티
      </Link>
      <div className="mt-4">
        <VerifyBanner verification={verification} />
      </div>

      <article>
        <BoardTag board={post.board} />
        <h1 className="mt-2 text-[22px] leading-[1.4] font-extrabold tracking-[-0.04em] md:text-[28px]">
          {post.title}
        </h1>
        <div className="mt-3 flex items-center gap-2.5 border-b border-line pb-4">
          <span className="flex size-9 items-center justify-center rounded-full bg-surface text-sm font-bold text-sub">
            {post.authorName[0]}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[14.5px] font-bold">{post.authorName}</p>
            <p className="text-xs text-faint">
              {timeAgo(post.createdAt)} · 조회{" "}
              {post.viewCount.toLocaleString("ko-KR")}
            </p>
          </div>
          {post.mine &&
            (confirming ? (
              <span className="flex items-center gap-2 text-[13px] font-semibold">
                <button
                  type="button"
                  onClick={deletePost}
                  disabled={remove.isPending}
                  className="text-soon disabled:opacity-50"
                >
                  삭제할게요
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="text-sub"
                >
                  취소
                </button>
              </span>
            ) : (
              <button
                type="button"
                aria-label="글 삭제"
                onClick={() => setConfirming(true)}
                className="p-1.5 text-faint hover:text-ink"
              >
                <Trash2 size={18} />
              </button>
            ))}
        </div>

        {post.seminar && (
          <div className="mt-4 flex items-center gap-3 rounded-[14px] bg-surface px-4 py-3.5">
            <Link2 size={16} strokeWidth={2} className="shrink-0 text-sub" />
            <div className="min-w-0">
              <p className="truncate text-[14.5px] font-bold">
                {post.seminar.title}
              </p>
              <p className="truncate text-[12.5px] text-sub">
                {[
                  post.seminar.host,
                  formatSchedule(post.seminar.startDate, post.seminar.endDate),
                  post.seminar.region,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 text-[15.5px] leading-[1.85] whitespace-pre-line text-[#222]">
          {post.content}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            aria-pressed={post.liked}
            onClick={toggleLike}
            className={cn(
              "inline-flex h-11 items-center gap-1.5 rounded-full border px-5 text-sm font-semibold transition-colors",
              post.liked
                ? "border-ink bg-ink text-white"
                : "border-[#E4E4E4] text-ink hover:border-ink",
            )}
          >
            <Heart
              size={16}
              strokeWidth={2}
              className={post.liked ? "fill-white" : ""}
            />
            공감 {post.likeCount}
          </button>
        </div>
      </article>

      {post.commentsLocked ? (
        <CommentsLocked count={post.commentCount} access={access} />
      ) : (
        <Comments post={post} />
      )}
    </Container>
  );
}

function Comments({ post }: { post: PostDetailData }) {
  const add = useAddCommentMutation(post.id);
  const [content, setContent] = useState("");
  const [anonymous, setAnonymous] = useState(post.board === "FREE");
  const length = content.trim().length;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (length === 0 || add.isPending) return;
    add.mutate(
      { content: content.trim(), anonymous },
      {
        onSuccess: () => setContent(""),
        onError: (error) =>
          toast(
            isVerificationRequired(error)
              ? "면허 인증 후 댓글을 쓸 수 있어요"
              : apiErrorMessage(
                  error,
                  "댓글을 남기지 못했어요. 잠시 후 다시 시도해주세요",
                ),
            isVerificationRequired(error)
              ? { label: "인증하기", href: "/verify" }
              : undefined,
          ),
      },
    );
  }

  return (
    <section className="mt-12">
      <h2 className="text-[17px] font-extrabold">댓글 {post.commentCount}</h2>

      <form onSubmit={submit} className="mt-4">
        <label htmlFor="comment" className="sr-only">
          댓글
        </label>
        <textarea
          id="comment"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          maxLength={COMMENT_MAX}
          rows={3}
          placeholder="따뜻한 댓글을 남겨주세요"
          className="w-full resize-none rounded-[12px] border border-[#E1E1E1] p-3.5 text-[14.5px] leading-[1.6] outline-none placeholder:text-faint focus:border-ink"
        />
        <div className="mt-2 flex items-center justify-between">
          <label className="flex items-center gap-2 text-[13px] text-sub">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(event) => setAnonymous(event.target.checked)}
              className="size-4 accent-[#0F7B6C]"
            />
            익명
          </label>
          <button
            type="submit"
            disabled={length === 0 || add.isPending}
            className="inline-flex h-10 items-center rounded-full bg-ink px-5 text-sm font-bold text-white disabled:bg-[#CFCFCF]"
          >
            등록
          </button>
        </div>
      </form>

      <div className="mt-2">
        {post.comments.length === 0 ? (
          <p className="py-10 text-center text-[14px] text-sub">
            첫 댓글을 남겨보세요
          </p>
        ) : (
          post.comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </section>
  );
}

function CommentItem({ comment }: { comment: PostComment }) {
  const remove = useDeleteCommentMutation();

  return (
    <div className="flex gap-2.5 border-b border-line py-4">
      <span className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-surface text-xs font-bold text-sub">
        {comment.authorName[0]}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-[13px]">
          <b>{comment.authorName}</b>
          {comment.byAuthor && (
            <span className="rounded bg-[#E6F2EF] px-1.5 text-[11px] font-bold text-brand">
              작성자
            </span>
          )}
          <span className="text-faint">{timeAgo(comment.createdAt)}</span>
          {comment.mine && (
            <button
              type="button"
              aria-label="댓글 삭제"
              disabled={remove.isPending}
              onClick={() =>
                remove.mutate(comment.id, {
                  onError: (error) =>
                    toast(
                      apiErrorMessage(
                        error,
                        "삭제하지 못했어요. 잠시 후 다시 시도해주세요",
                      ),
                    ),
                })
              }
              className="ml-auto p-1 text-faint hover:text-ink disabled:opacity-50"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
        <p className="mt-1 text-[14.5px] leading-[1.6] whitespace-pre-line">
          {comment.content}
        </p>
      </div>
    </div>
  );
}

// 승인 전에는 댓글 내용 대신 개수와 안내만 보인다. 뒤의 흐린 줄은 모양만 보여주는 자리 표시다
const lockCopy: Partial<
  Record<VerifyAccess, { title: string; body: string; cta?: { label: string; href: string } }>
> = {
  GUEST: {
    title: "로그인하고 인증하면 댓글을 볼 수 있어요",
    body: "물리치료사 동료들의 이야기를 읽고 참여해보세요",
    cta: { label: "로그인", href: "/login" },
  },
  NONE: {
    title: "면허 인증하면 댓글을 볼 수 있어요",
    body: "물리치료사 동료들의 이야기를 읽고 참여해보세요",
    cta: { label: "면허 인증하기", href: "/verify" },
  },
  PENDING: {
    title: "심사가 끝나면 댓글이 열려요",
    body: "보통 영업일 1일 안에 알려드려요",
  },
  REJECTED: {
    title: "재제출 후 승인되면 댓글이 열려요",
    body: "면허증 사진을 다시 올려주세요",
    cta: { label: "다시 제출하기", href: "/verify" },
  },
};

function CommentsLocked({
  count,
  access,
}: {
  count: number;
  access: VerifyAccess;
}) {
  const copy = lockCopy[access] ?? lockCopy.NONE!;
  return (
    <section className="mt-12" aria-label="댓글">
      <h2 className="text-[17px] font-extrabold">댓글 {count}</h2>
      <div className="mt-4 flex items-center gap-2 rounded-[12px] border border-[#EDEDED] bg-[#FAFAF9] px-4 py-4 text-[14.5px] text-[#A8A8A8]">
        <Lock size={16} className="shrink-0" />
        인증 후 댓글을 쓸 수 있어요
      </div>
      <div
        aria-hidden
        className="relative mt-2 h-[150px] overflow-hidden after:absolute after:inset-0 after:bg-gradient-to-b after:from-white/0 after:to-white after:to-85%"
      >
        <div className="space-y-4 py-4 opacity-75 blur-[5px] select-none">
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-2.5">
              <span className="size-[30px] shrink-0 rounded-full bg-surface" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 rounded bg-surface" />
                <div className="h-3.5 w-4/5 rounded bg-surface" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative z-10 -mt-[70px] flex flex-col items-center pb-2 text-center">
        <span className="flex size-11 items-center justify-center rounded-full bg-surface text-[#555]">
          <Lock size={18} />
        </span>
        <p className="mt-2 text-[17px] font-extrabold">{copy.title}</p>
        <p className="mt-1.5 mb-3 text-sm text-sub">{copy.body}</p>
        {copy.cta ? (
          <Link
            href={copy.cta.href}
            className="inline-flex h-10 items-center rounded-full bg-brand px-[18px] text-sm font-semibold text-white"
          >
            {copy.cta.label}
          </Link>
        ) : (
          <span className="inline-flex h-10 items-center rounded-full bg-[#E4E4E2] px-[18px] text-sm font-semibold text-[#9A9A9A]">
            심사 중이에요
          </span>
        )}
      </div>
    </section>
  );
}
