"use client";

import Link from "next/link";
import { MessageSquareText } from "lucide-react";

import { Container } from "@/components/layout/container";
import { ListStatus } from "@/components/seminar/list-status";
import { SeminarPoster } from "@/components/seminar/seminar-poster";
import { useBookmarksQuery } from "@/hooks/queries/bookmark/useBookmarksQuery";
import { useSession } from "@/hooks/useSession";
import { reviewStage, type SavedSeminar } from "@/lib/reviews";
import { ReviewAction } from "./review-action";
import { StarRating } from "./star-rating";

// 마이페이지 > 수강 후기. 저장한 세미나 중 끝난 것만 후기를 남길 수 있다
export function ReviewsPage() {
  const session = useSession();
  const bookmarks = useBookmarksQuery(Boolean(session));

  if (session === undefined) return <ReviewsSkeleton />;
  if (session === null) return <ReviewsLoginRequired />;

  const items = bookmarks.data ?? [];
  const waiting = items.filter((s) => ["ask", "write"].includes(reviewStage(s)));
  const written = items.filter((s) => reviewStage(s) === "written");

  return (
    <Container className="max-w-[820px] pt-6 pb-12 md:pt-11">
      <h1 className="text-[26px] font-extrabold tracking-[-0.045em] md:text-[30px]">수강 후기</h1>
      <p className="mt-2 text-[14.5px] leading-[1.6] text-sub">
        저장해둔 세미나가 끝나면 수강하셨는지 물어볼게요. 들은 세미나에만 후기를 남길 수 있어요.
      </p>

      {bookmarks.status === "pending" ? (
        <ReviewsListSkeleton />
      ) : bookmarks.status === "error" ? (
        <ListStatus status="error" empty="" />
      ) : (
        <>
          <Section title="후기를 기다려요" count={waiting.length}>
            {waiting.length === 0 ? (
              <EmptyBox
                message={
                  items.length === 0
                    ? "아직 저장한 세미나가 없어요"
                    : "지금 후기를 남길 세미나가 없어요"
                }
                hint="세미나를 저장해두면 끝난 뒤에 여기서 후기를 남길 수 있어요"
              />
            ) : (
              waiting.map((s) => <ReviewRow key={s.id} seminar={s} />)
            )}
          </Section>

          <Section title="작성한 후기" count={written.length}>
            {written.length === 0 ? (
              <EmptyBox message="아직 작성한 후기가 없어요" />
            ) : (
              written.map((s) => <ReviewRow key={s.id} seminar={s} showContent />)
            )}
          </Section>
        </>
      )}
    </Container>
  );
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="flex items-baseline gap-2 text-xl font-extrabold tracking-[-0.04em]">
        {title}
        <span className="text-[15px] font-bold text-faint">{count}</span>
      </h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}

function ReviewRow({ seminar, showContent = false }: { seminar: SavedSeminar; showContent?: boolean }) {
  return (
    <article className="border-b border-line py-5 last:border-b-0">
      <div className="flex items-start gap-3.5">
        <div className="shrink-0 overflow-hidden rounded-[10px]">
          <SeminarPoster poster={seminar.poster} width={64} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
          <span className="truncate text-xs text-sub">{seminar.host}</span>
          <h3 className="line-clamp-2 text-[15px] leading-[1.38] font-bold tracking-[-0.03em]">{seminar.title}</h3>
          <span className="text-[12.5px] text-sub">
            {seminar.schedule} · {seminar.city}
          </span>
        </div>
      </div>
      {showContent && seminar.review && (
        <div className="mt-3 rounded-[12px] border border-line px-4 py-3.5">
          <StarRating value={seminar.review.rating} size={15} />
          <p className="mt-2 text-[14.5px] leading-[1.7] whitespace-pre-line">{seminar.review.content}</p>
        </div>
      )}
      <ReviewAction seminar={seminar} />
    </article>
  );
}

function EmptyBox({ message, hint }: { message: string; hint?: string }) {
  return (
    <div className="mt-3 flex flex-col items-center rounded-[20px] border border-dashed border-[#E4E4E4] px-6 py-10 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-surface">
        <MessageSquareText size={19} strokeWidth={2} />
      </span>
      <p className="mt-3.5 text-[15px] font-bold">{message}</p>
      {hint && <p className="mt-1 text-[13px] text-sub">{hint}</p>}
      <Link href="/search" className="mt-4 text-[13.5px] font-semibold text-sub underline underline-offset-2">
        세미나 둘러보기
      </Link>
    </div>
  );
}

export function ReviewsLoginRequired() {
  return (
    <Container className="flex justify-center py-20 md:py-28">
      <div className="w-full max-w-[380px] text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-surface">
          <MessageSquareText size={22} strokeWidth={2} />
        </span>
        <h1 className="mt-6 text-2xl font-extrabold tracking-[-0.04em]">로그인이 필요해요</h1>
        <p className="mt-2 text-[15px] leading-[1.55] text-sub">
          로그인하고 저장한 세미나의
          <br />
          후기를 남겨보세요
        </p>
        <Link href="/login" className="mt-8 flex h-12 items-center justify-center rounded-full bg-ink text-[15px] font-bold text-white">
          로그인
        </Link>
      </div>
    </Container>
  );
}

export function ReviewsSkeleton() {
  return (
    <Container className="max-w-[820px] pt-6 md:pt-11" aria-busy>
      <div className="skeleton h-9 w-40 rounded-lg" />
      <ReviewsListSkeleton />
    </Container>
  );
}

function ReviewsListSkeleton() {
  return (
    <div className="mt-10 space-y-5" aria-busy>
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="skeleton h-[96px] rounded-[14px]" />
      ))}
    </div>
  );
}
