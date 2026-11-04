import Link from "next/link";
import { Heart, Image as ImageIcon, Link2, MessageCircle, Star } from "lucide-react";

import { StarRating } from "@/components/review/star-rating";
import { boardLabel, plainContent, timeAgo, type Post } from "@/lib/community";
import { formatSchedule } from "@/lib/seminars";
import { cn } from "@/lib/utils";
import { EventTag, HiddenTag, OperatorBadge, ScheduledTag } from "./post-badges";

export function BoardTag({
  board,
  className,
}: {
  board: Post["board"];
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-[22px] items-center rounded-md px-2 text-xs font-semibold whitespace-nowrap",
        board === "REVIEW" ? "bg-[#E6F2EF] text-brand" : "bg-surface text-sub",
        className,
      )}
    >
      {boardLabel(board)}
    </span>
  );
}

// 글 분야 태그 (도수치료, 테이핑 …)
export function FieldTag({ field }: { field: string }) {
  return (
    <span className="inline-flex h-[22px] items-center rounded-md border border-[#E4E4E4] px-1.5 text-[11.5px] font-medium whitespace-nowrap text-sub">
      #{field}
    </span>
  );
}

// 글 목록 한 줄. 세미나 후기 글에는 연결된 세미나가 칩으로 붙는다
export function PostItem({ post }: { post: Post }) {
  return (
    <article className="border-b border-line">
      <Link href={`/community/${post.id}`} className="block py-4 md:py-5">
        <div className="flex flex-wrap items-center gap-1.5">
          <BoardTag board={post.board} />
          {post.hidden && <HiddenTag />}
          {post.eventEntry && <EventTag />}
          {post.scheduled && <ScheduledTag at={post.createdAt} />}
          {post.fields.map((field) => (
            <FieldTag key={field} field={field} />
          ))}
        </div>
        <h3 className="mt-1.5 line-clamp-2 text-[15.5px] leading-[1.4] font-bold tracking-[-0.03em] md:text-[16.5px]">
          {post.title}
        </h3>
        {post.rating !== null && (
          <StarRating value={post.rating} size={13} className="mt-1.5" />
        )}
        <p className="mt-1 line-clamp-2 text-[13.5px] leading-[1.55] text-sub md:text-sm">
          {plainContent(post.content)}
        </p>
        {post.seminar && (
          <span className="mt-2.5 flex h-[30px] w-fit max-w-full items-center gap-1.5 rounded-lg bg-surface px-2.5 text-[12.5px] text-[#444]">
            <Link2 size={13} strokeWidth={2} className="shrink-0" />
            <span className="truncate">
              {post.seminar.title} ·{" "}
              {formatSchedule(post.seminar.startDate, post.seminar.endDate)}
            </span>
            {post.seminar.avgRating !== null && (
              <span className="flex shrink-0 items-center gap-0.5 font-bold text-[#E3A008]">
                <Star size={12} className="fill-[#E3A008]" strokeWidth={0} />
                {post.seminar.avgRating.toFixed(1)}
              </span>
            )}
          </span>
        )}
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-faint">
          <b className="font-semibold text-[#333]">{post.authorName}</b>
          {post.byOperator && <OperatorBadge />}
          {!post.scheduled && (
            <>
              <span>·</span>
              <span>{timeAgo(post.createdAt)}</span>
            </>
          )}
          <span className="ml-auto flex items-center gap-2.5">
            {post.images.length > 0 && (
              <span className="flex items-center gap-1">
                <ImageIcon size={13} strokeWidth={1.8} />
                {post.images.length}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Heart size={13} strokeWidth={1.8} />
              {post.likeCount}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle size={13} strokeWidth={1.8} />
              {post.commentCount}
            </span>
          </span>
        </div>
      </Link>
    </article>
  );
}
