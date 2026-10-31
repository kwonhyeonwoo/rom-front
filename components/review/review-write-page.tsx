"use client";

import Link from "next/link";

import { Container } from "@/components/layout/container";
import { SeminarPoster } from "@/components/seminar/seminar-poster";
import { useBookmarksQuery } from "@/hooks/queries/bookmark/useBookmarksQuery";
import { useSession } from "@/hooks/useSession";
import { useVerifyAccess } from "@/hooks/useVerifyAccess";
import { reviewStage } from "@/lib/reviews";
import { AttendanceButtons } from "./attendance-buttons";
import { ReviewForm } from "./review-form";
import { ReviewsLoginRequired, ReviewsSkeleton } from "./reviews-page";

// 후기 작성·수정. 저장한 세미나이고 수강했다고 답한 경우에만 폼이 열린다
export function ReviewWritePage({ seminarId }: { seminarId: string }) {
  const session = useSession();
  const bookmarks = useBookmarksQuery(Boolean(session));
  const { access } = useVerifyAccess();

  if (session === undefined || (session && bookmarks.status === "pending")) return <ReviewsSkeleton />;
  if (session === null) return <ReviewsLoginRequired />;
  if (bookmarks.status === "error") {
    return (
      <Notice title="불러오지 못했어요">
        <p>잠시 후 다시 시도해주세요.</p>
      </Notice>
    );
  }

  const seminar = (bookmarks.data ?? []).find((s) => s.id === seminarId);
  if (!seminar) {
    return (
      <Notice title="저장한 세미나에만 후기를 남길 수 있어요">
        <p>세미나를 저장해두면 끝난 뒤에 후기를 남길 수 있어요.</p>
      </Notice>
    );
  }

  const stage = reviewStage(seminar);

  return (
    <Container className="max-w-[640px] pt-6 pb-12 md:pt-11">
      <h1 className="text-[26px] font-extrabold tracking-[-0.045em]">{seminar.review ? "후기 수정" : "후기 쓰기"}</h1>

      <div className="mt-5 flex items-start gap-3.5 rounded-[14px] bg-surface p-3.5">
        <div className="shrink-0 overflow-hidden rounded-[8px]">
          <SeminarPoster poster={seminar.poster} width={56} />
        </div>
        <div className="min-w-0">
          <span className="block truncate text-xs text-sub">{seminar.host}</span>
          <h2 className="line-clamp-2 text-[15px] leading-[1.38] font-bold tracking-[-0.03em]">{seminar.title}</h2>
          <span className="text-[12.5px] text-sub">{seminar.schedule}</span>
        </div>
      </div>

      {stage === "upcoming" && (
        <p className="mt-8 text-[15px] leading-[1.6] text-sub">
          아직 끝나지 않은 세미나예요. 세미나가 끝난 뒤에 후기를 남길 수 있어요.
        </p>
      )}
      {(stage === "ask" || stage === "skipped") && (
        <div className="mt-8">
          <p className="text-[15px] font-bold">이 세미나를 수강하셨나요?</p>
          <p className="mt-1 mb-4 text-[13.5px] text-sub">들은 세미나에만 후기를 남길 수 있어요.</p>
          <AttendanceButtons seminarId={seminar.id} />
        </div>
      )}
      {(stage === "write" || stage === "written") &&
        (access === "APPROVED" || access === "LOADING" ? (
          <ReviewForm seminar={seminar} />
        ) : (
          <div className="mt-8 rounded-[14px] bg-surface p-5">
            <p className="text-[15px] font-bold">
              {access === "PENDING" ? "면허 심사가 끝나면 후기를 쓸 수 있어요" : "면허 인증 후 후기를 쓸 수 있어요"}
            </p>
            <p className="mt-1 text-[13.5px] leading-[1.55] text-sub">
              {access === "PENDING"
                ? "보통 영업일 1일 안에 알려드려요."
                : "면허를 한 번만 인증하면 후기와 커뮤니티 글을 쓸 수 있어요."}
            </p>
            {access !== "PENDING" && (
              <Link
                href={access === "GUEST" ? "/login" : "/verify"}
                className="mt-4 inline-flex h-10 items-center rounded-full bg-ink px-5 text-sm font-bold text-white"
              >
                {access === "NONE" || access === "GUEST" ? "면허 인증하기" : "다시 제출하기"}
              </Link>
            )}
          </div>
        ))}
    </Container>
  );
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Container className="flex justify-center py-20 md:py-28">
      <div className="w-full max-w-[380px] text-center">
        <h1 className="text-xl font-extrabold tracking-[-0.04em]">{title}</h1>
        <div className="mt-2 text-[15px] leading-[1.55] text-sub">{children}</div>
        <Link href="/reviews" className="mt-8 flex h-12 items-center justify-center rounded-full bg-ink text-[15px] font-bold text-white">
          수강 후기로 가기
        </Link>
      </div>
    </Container>
  );
}
