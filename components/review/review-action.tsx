"use client";

import Link from "next/link";

import { useAttendanceMutation } from "@/hooks/mutations/bookmark/useAttendanceMutation";
import { reviewStage, type SavedSeminar } from "@/lib/reviews";
import { toast } from "@/stores/use-toast-store";
import { AttendanceButtons } from "./attendance-buttons";
import { StarRating } from "./star-rating";

const linkButton =
  "inline-flex h-9 items-center rounded-full bg-ink px-4 text-[13.5px] font-bold text-white";

// 저장한 세미나 아래에 붙는 후기 안내. 세미나가 끝나기 전에는 아무것도 보이지 않는다
export function ReviewAction({ seminar }: { seminar: SavedSeminar }) {
  const attendance = useAttendanceMutation();
  const stage = reviewStage(seminar);
  const href = `/reviews/${encodeURIComponent(seminar.id)}`;

  if (stage === "upcoming") return null;

  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-[12px] bg-surface px-3.5 py-3">
      {stage === "ask" && (
        <>
          <span className="text-[13.5px] font-semibold">수강하셨나요?</span>
          <AttendanceButtons seminarId={seminar.id} onAttended={() => toast("후기를 남겨보세요", { label: "쓰기", href })} />
        </>
      )}
      {stage === "write" && (
        <>
          <span className="text-[13.5px] font-semibold">들은 세미나예요. 후기를 남겨보세요</span>
          <Link href={href} className={linkButton}>
            후기 쓰기
          </Link>
        </>
      )}
      {stage === "written" && seminar.review && (
        <>
          <span className="flex items-center gap-2 text-[13.5px] font-semibold">
            후기 작성함 <StarRating value={seminar.review.rating} size={14} />
          </span>
          <Link href={href} className="text-[13px] font-semibold text-sub underline underline-offset-2">
            수정
          </Link>
        </>
      )}
      {stage === "skipped" && (
        <>
          <span className="text-[13.5px] text-sub">듣지 않은 세미나예요</span>
          <button
            type="button"
            disabled={attendance.isPending}
            onClick={() => attendance.mutate({ seminarId: seminar.id, attended: true })}
            className="text-[13px] font-semibold text-sub underline underline-offset-2 disabled:opacity-50"
          >
            들었어요로 바꾸기
          </button>
        </>
      )}
    </div>
  );
}
