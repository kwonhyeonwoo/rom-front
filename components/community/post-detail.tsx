"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Heart, Link2, Trash2 } from "lucide-react";

import { Container } from "@/components/layout/container";
import { useAddCommentMutation } from "@/hooks/mutations/community/useAddCommentMutation";
import { useDeleteCommentMutation } from "@/hooks/mutations/community/useDeleteCommentMutation";
import { useDeletePostMutation } from "@/hooks/mutations/community/useDeletePostMutation";
import { useToggleLikeMutation } from "@/hooks/mutations/community/useToggleLikeMutation";
import { usePostQuery } from "@/hooks/queries/community/usePostQuery";
import { useSession } from "@/hooks/useSession";
import { ApiError, apiErrorMessage } from "@/lib/api";
import { COMMENT_MAX, timeAgo, type PostComment, type PostDetail as PostDetailData } from "@/lib/community";
import { formatSchedule } from "@/lib/seminars";
import { cn } from "@/lib/utils";
import { toast } from "@/stores/use-toast-store";
import { CommunityLoginRequired, CommunitySkeleton } from "./login-required";
import { BoardTag } from "./post-item";

export function PostDetail({ postId }: { postId: string }) {
  const session = useSession();
  const post = usePostQuery(postId, Boolean(session));

  if (session === undefined || (session && post.status === "pending")) return <CommunitySkeleton />;
  if (session === null) return <CommunityLoginRequired />;
  if (post.status === "error" || !post.data) {
    const missing = post.error instanceof ApiError && post.error.status === 404;
    return (
      <Container className="flex justify-center py-20 md:py-28">
        <div className="w-full max-w-[380px] text-center">
          <h1 className="text-xl font-extrabold tracking-[-0.04em]">{missing ? "글을 찾을 수 없어요" : "불러오지 못했어요"}</h1>
          <p className="mt-2 text-[15px] text-sub">{missing ? "삭제됐거나 없는 글이에요." : "잠시 후 다시 시도해주세요."}</p>
          <Link href="/community" className="mt-8 flex h-12 items-center justify-center rounded-full bg-ink text-[15px] font-bold text-white">
            커뮤니티로 가기
          </Link>
        </div>
      </Container>
    );
  }

  return <PostView post={post.data} />;
}

function PostView({ post }: { post: PostDetailData }) {
  const router = useRouter();
  const like = useToggleLikeMutation(post.id);
  const remove = useDeletePostMutation();
  const [confirming, setConfirming] = useState(false);

  function deletePost() {
    remove.mutate(post.id, {
      onSuccess: () => {
        toast("글을 삭제했어요");
        router.replace("/community");
      },
      onError: (error) => toast(apiErrorMessage(error, "삭제하지 못했어요. 잠시 후 다시 시도해주세요")),
    });
  }

  return (
    <Container className="max-w-[720px] pt-4 pb-12 md:pt-9">
      <Link href="/community" className="inline-flex items-center gap-0.5 text-[13.5px] font-semibold text-sub hover:text-ink">
        <ChevronLeft size={16} />
        커뮤니티
      </Link>

      <article className="mt-4">
        <BoardTag board={post.board} />
        <h1 className="mt-2 text-[22px] leading-[1.4] font-extrabold tracking-[-0.04em] md:text-[28px]">{post.title}</h1>
        <div className="mt-3 flex items-center gap-2.5 border-b border-line pb-4">
          <span className="flex size-9 items-center justify-center rounded-full bg-surface text-sm font-bold text-sub">{post.authorName[0]}</span>
          <div className="min-w-0 flex-1">
            <p className="text-[14.5px] font-bold">{post.authorName}</p>
            <p className="text-xs text-faint">
              {timeAgo(post.createdAt)} · 조회 {post.viewCount.toLocaleString("ko-KR")}
            </p>
          </div>
          {post.mine &&
            (confirming ? (
              <span className="flex items-center gap-2 text-[13px] font-semibold">
                <button type="button" onClick={deletePost} disabled={remove.isPending} className="text-soon disabled:opacity-50">
                  삭제할게요
                </button>
                <button type="button" onClick={() => setConfirming(false)} className="text-sub">
                  취소
                </button>
              </span>
            ) : (
              <button type="button" aria-label="글 삭제" onClick={() => setConfirming(true)} className="p-1.5 text-faint hover:text-ink">
                <Trash2 size={18} />
              </button>
            ))}
        </div>

        {post.seminar && (
          <div className="mt-4 flex items-center gap-3 rounded-[14px] bg-surface px-4 py-3.5">
            <Link2 size={16} strokeWidth={2} className="shrink-0 text-sub" />
            <div className="min-w-0">
              <p className="truncate text-[14.5px] font-bold">{post.seminar.title}</p>
              <p className="truncate text-[12.5px] text-sub">
                {[post.seminar.host, formatSchedule(post.seminar.startDate, post.seminar.endDate), post.seminar.region]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 text-[15.5px] leading-[1.85] whitespace-pre-line text-[#222]">{post.content}</div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            aria-pressed={post.liked}
            onClick={() => like.mutate(!post.liked)}
            className={cn(
              "inline-flex h-11 items-center gap-1.5 rounded-full border px-5 text-sm font-semibold transition-colors",
              post.liked ? "border-ink bg-ink text-white" : "border-[#E4E4E4] text-ink hover:border-ink",
            )}
          >
            <Heart size={16} strokeWidth={2} className={post.liked ? "fill-white" : ""} />
            공감 {post.likeCount}
          </button>
        </div>
      </article>

      <Comments post={post} />
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
        onError: (error) => toast(apiErrorMessage(error, "댓글을 남기지 못했어요. 잠시 후 다시 시도해주세요")),
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
            <input type="checkbox" checked={anonymous} onChange={(event) => setAnonymous(event.target.checked)} className="size-4 accent-[#0F7B6C]" />
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
          <p className="py-10 text-center text-[14px] text-sub">첫 댓글을 남겨보세요</p>
        ) : (
          post.comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
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
          {comment.byAuthor && <span className="rounded bg-[#E6F2EF] px-1.5 text-[11px] font-bold text-brand">작성자</span>}
          <span className="text-faint">{timeAgo(comment.createdAt)}</span>
          {comment.mine && (
            <button
              type="button"
              aria-label="댓글 삭제"
              disabled={remove.isPending}
              onClick={() =>
                remove.mutate(comment.id, {
                  onError: (error) => toast(apiErrorMessage(error, "삭제하지 못했어요. 잠시 후 다시 시도해주세요")),
                })
              }
              className="ml-auto p-1 text-faint hover:text-ink disabled:opacity-50"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
        <p className="mt-1 text-[14.5px] leading-[1.6] whitespace-pre-line">{comment.content}</p>
      </div>
    </div>
  );
}
