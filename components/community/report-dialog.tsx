"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Siren, X } from "lucide-react";

import { useReportMutation } from "@/hooks/mutations/community/useReportMutation";
import { ApiError, apiErrorMessage } from "@/lib/api";
import {
  REPORT_DETAIL_MAX,
  REPORT_DETAIL_MIN,
  reportReasons,
  type ReportReason,
  type ReportTarget,
} from "@/lib/report";
import { cn } from "@/lib/utils";
import { toast } from "@/stores/use-toast-store";

// 신고 버튼. 비회원이면 로그인으로 안내하고, 이미 신고했으면 "신고함"으로 막는다.
// 내 글·댓글에는 그리지 않는다 (서버도 막는다)
export function ReportButton({
  target,
  id,
  reported,
  loggedIn,
  compact = false,
}: {
  target: ReportTarget;
  id: string;
  reported: boolean;
  loggedIn: boolean;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);

  function click() {
    if (!loggedIn) {
      toast("로그인하면 신고할 수 있어요", { label: "로그인", href: "/login" });
      return;
    }
    if (reported) {
      toast("이미 신고했어요. 운영팀이 확인하고 있어요");
      return;
    }
    setOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={click}
        aria-label={target === "POST" ? "글 신고" : "댓글 신고"}
        className={cn(
          "inline-flex items-center gap-1 text-faint hover:text-ink",
          compact ? "p-1 text-[12px]" : "p-1.5 text-[13px] font-semibold",
          reported && "text-[#C4C4C4] hover:text-[#C4C4C4]",
        )}
      >
        <Siren size={compact ? 14 : 16} strokeWidth={1.9} />
        {reported ? "신고함" : compact ? null : "신고"}
      </button>
      {open && <ReportDialog target={target} id={id} onClose={() => setOpen(false)} />}
    </>
  );
}

function ReportDialog({ target, id, onClose }: { target: ReportTarget; id: string; onClose: () => void }) {
  const report = useReportMutation();
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [detail, setDetail] = useState("");
  const titleId = useId();
  const panel = useRef<HTMLFormElement>(null);
  const trimmed = detail.trim();
  const needsDetail = reason === "ETC";
  const valid =
    reason !== null &&
    (needsDetail ? trimmed.length >= REPORT_DETAIL_MIN : trimmed.length === 0 || trimmed.length >= REPORT_DETAIL_MIN);
  const noun = target === "POST" ? "글" : "댓글";

  // Esc로 닫고, 열려 있는 동안 뒤 화면이 스크롤되지 않게 한다
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLInputElement>("input")?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!valid || !reason || report.isPending) return;
    report.mutate(
      { target, id, reason, detail: trimmed || undefined },
      {
        onSuccess: () => {
          toast("신고했어요. 운영팀이 확인하고 결과를 알림으로 알려드려요");
          onClose();
        },
        onError: (error) => {
          // 이미 신고했으면 화면도 "신고함"으로 맞춘다
          if (error instanceof ApiError && error.status === 409) onClose();
          toast(apiErrorMessage(error, "신고하지 못했어요. 잠시 후 다시 시도해주세요"));
        },
      },
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 md:items-center"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <form
        ref={panel}
        role="dialog"
        aria-modal
        aria-labelledby={titleId}
        onSubmit={submit}
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-[20px] bg-white px-5 pt-5 pb-[max(20px,env(safe-area-inset-bottom))] md:max-w-[440px] md:rounded-[20px] md:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id={titleId} className="text-[19px] font-extrabold tracking-[-0.04em]">
              {noun} 신고
            </h2>
            <p className="mt-1 text-[13px] leading-[1.5] text-sub">
              신고한 사람은 작성자에게 알려지지 않아요. 운영팀이 확인한 뒤 결과를 알림으로 알려드려요.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="닫기" className="-mt-1 -mr-1 p-1.5 text-faint hover:text-ink">
            <X size={20} />
          </button>
        </div>

        <fieldset className="mt-4">
          <legend className="sr-only">신고 사유</legend>
          <div className="flex flex-col gap-1.5">
            {reportReasons.map((item) => (
              <label
                key={item.value}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-[12px] border px-3.5 py-3 transition-colors",
                  reason === item.value ? "border-ink bg-white" : "border-[#EAEAEA] hover:border-[#CFCFCF]",
                )}
              >
                <input
                  type="radio"
                  name="reason"
                  value={item.value}
                  checked={reason === item.value}
                  onChange={() => setReason(item.value)}
                  className="mt-0.5 size-4 shrink-0 accent-[#0F7B6C]"
                />
                <span>
                  <span className="block text-[14.5px] font-bold">{item.label}</span>
                  <span className="mt-0.5 block text-[12.5px] text-sub">{item.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <label htmlFor={`${titleId}-detail`} className="mt-4 block text-[13.5px] font-bold">
          자세한 내용 {needsDetail ? <span className="text-soon">(필수)</span> : <span className="font-medium text-faint">(선택)</span>}
        </label>
        <textarea
          id={`${titleId}-detail`}
          value={detail}
          onChange={(event) => setDetail(event.target.value)}
          maxLength={REPORT_DETAIL_MAX}
          rows={3}
          placeholder={needsDetail ? "어떤 문제가 있는지 알려주세요" : "운영팀이 판단하는 데 도움이 돼요"}
          className="mt-1.5 w-full resize-none rounded-[12px] border border-[#E1E1E1] px-3.5 py-3 text-[14px] leading-[1.55] outline-none placeholder:text-faint focus:border-ink"
        />
        <p className="flex justify-between text-[12px] text-faint">
          <span>{trimmed.length > 0 && trimmed.length < REPORT_DETAIL_MIN ? `${REPORT_DETAIL_MIN}자 이상 적어주세요` : ""}</span>
          <span className="tabular-nums">
            {trimmed.length}/{REPORT_DETAIL_MAX}
          </span>
        </p>

        <div className="mt-3 flex gap-2">
          <button type="button" onClick={onClose} className="h-12 flex-1 rounded-full border border-[#E4E4E4] text-[15px] font-bold">
            취소
          </button>
          <button
            type="submit"
            disabled={!valid || report.isPending}
            className="h-12 flex-[2] rounded-full bg-soon text-[15px] font-bold text-white disabled:opacity-40"
          >
            {report.isPending ? "보내는 중…" : "신고하기"}
          </button>
        </div>
      </form>
    </div>
  );
}
