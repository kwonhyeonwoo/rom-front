"use client";

import { useAttendanceMutation } from "@/hooks/mutations/bookmark/useAttendanceMutation";
import { apiErrorMessage } from "@/lib/api";
import { toast } from "@/stores/use-toast-store";

// "수강하셨나요?" 답 버튼. 끝난 저장 세미나에서만 쓴다
export function AttendanceButtons({ seminarId, onAttended }: { seminarId: string; onAttended?: () => void }) {
  const attendance = useAttendanceMutation();

  function answer(attended: boolean) {
    attendance.mutate(
      { seminarId, attended },
      {
        onSuccess: () => {
          if (attended) onAttended?.();
          else toast("저장 목록에서 수강 안 함으로 표시했어요");
        },
        onError: (error) => toast(apiErrorMessage(error, "저장하지 못했어요. 잠시 후 다시 시도해주세요")),
      },
    );
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={attendance.isPending}
        onClick={() => answer(true)}
        className="inline-flex h-9 items-center rounded-full bg-ink px-4 text-[13.5px] font-bold text-white disabled:opacity-50"
      >
        들었어요
      </button>
      <button
        type="button"
        disabled={attendance.isPending}
        onClick={() => answer(false)}
        className="inline-flex h-9 items-center rounded-full border border-[#E4E4E4] px-4 text-[13.5px] font-bold text-ink disabled:opacity-50"
      >
        안 들었어요
      </button>
    </div>
  );
}
