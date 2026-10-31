"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useDeleteReviewMutation } from "@/hooks/mutations/review/useDeleteReviewMutation";
import { useSaveReviewMutation } from "@/hooks/mutations/review/useSaveReviewMutation";
import { apiErrorMessage } from "@/lib/api";
import { REVIEW_MAX_LENGTH, REVIEW_MIN_LENGTH, type SavedSeminar } from "@/lib/reviews";
import { cn } from "@/lib/utils";
import { isVerificationRequired } from "@/lib/verification";
import { toast } from "@/stores/use-toast-store";
import { StarRating } from "./star-rating";

const ratingLabels = ["", "별로예요", "아쉬워요", "보통이에요", "좋았어요", "최고예요"];

export function ReviewForm({ seminar }: { seminar: SavedSeminar }) {
  const router = useRouter();
  const save = useSaveReviewMutation();
  const remove = useDeleteReviewMutation();
  const editing = seminar.review !== null;

  const [rating, setRating] = useState(seminar.review?.rating ?? 0);
  const [content, setContent] = useState(seminar.review?.content ?? "");
  const length = content.trim().length;
  const valid = rating > 0 && length >= REVIEW_MIN_LENGTH && length <= REVIEW_MAX_LENGTH;
  const busy = save.isPending || remove.isPending;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!valid || busy) return;
    save.mutate(
      { seminarId: seminar.id, rating, content: content.trim() },
      {
        onSuccess: () => {
          toast(editing ? "후기를 수정했어요" : "후기를 남겼어요");
          router.push("/reviews");
        },
        onError: (error) =>
          isVerificationRequired(error)
            ? toast("면허 인증 후 후기를 쓸 수 있어요", { label: "인증하기", href: "/verify" })
            : toast(apiErrorMessage(error, "후기를 저장하지 못했어요. 잠시 후 다시 시도해주세요")),
      },
    );
  }

  function handleDelete() {
    if (busy) return;
    remove.mutate(seminar.id, {
      onSuccess: () => {
        toast("후기를 삭제했어요");
        router.push("/reviews");
      },
      onError: (error) => toast(apiErrorMessage(error, "삭제하지 못했어요. 잠시 후 다시 시도해주세요")),
    });
  }

  return (
    <form onSubmit={submit} className="mt-8">
      <fieldset className="min-w-0">
        <legend className="text-[15px] font-bold">세미나는 어땠나요?</legend>
        <div className="mt-3 flex items-center gap-3">
          <StarRating value={rating} onChange={setRating} size={32} />
          <span className="text-sm font-semibold text-sub">{ratingLabels[rating]}</span>
        </div>
      </fieldset>

      <div className="mt-8">
        <label htmlFor="review-content" className="text-[15px] font-bold">
          후기
        </label>
        <textarea
          id="review-content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          maxLength={REVIEW_MAX_LENGTH}
          rows={9}
          placeholder="강의 구성, 실습 비중, 임상에 도움이 된 점을 자유롭게 적어주세요. 환자가 알아볼 수 있는 정보는 쓰지 말아주세요."
          className="mt-3 w-full resize-y rounded-[14px] border border-[#E1E1E1] bg-white p-4 text-[15px] leading-[1.7] outline-none placeholder:text-faint focus:border-ink"
        />
        <p className={cn("mt-1.5 text-right text-[12.5px]", length > 0 && length < REVIEW_MIN_LENGTH ? "text-soon" : "text-faint")}>
          {length < REVIEW_MIN_LENGTH ? `${REVIEW_MIN_LENGTH}자 이상 적어주세요 · ` : ""}
          {length.toLocaleString("ko-KR")} / {REVIEW_MAX_LENGTH.toLocaleString("ko-KR")}
        </p>
      </div>

      <div className="mt-8 flex items-center gap-2">
        <button
          type="submit"
          disabled={!valid || busy}
          className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-ink text-[15px] font-bold text-white disabled:bg-[#CFCFCF] md:flex-none md:px-10"
        >
          {save.isPending ? "저장하는 중" : editing ? "수정 완료" : "후기 등록"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={busy}
            className="inline-flex h-12 items-center rounded-full px-5 text-[14px] font-semibold text-sub hover:text-soon disabled:opacity-50"
          >
            삭제
          </button>
        )}
      </div>
    </form>
  );
}
