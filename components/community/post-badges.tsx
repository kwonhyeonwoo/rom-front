import { CalendarClock, EyeOff, PartyPopper, ShieldCheck } from "lucide-react";

import type { HiddenState } from "@/lib/community";

import { formatPublishAt } from "@/lib/community";
import { cn } from "@/lib/utils";

const chip =
  "inline-flex h-[20px] shrink-0 items-center gap-0.5 rounded px-1.5 text-[11px] font-bold whitespace-nowrap";

// 운영 계정이 쓴 글·댓글. 이름("ROM 운영팀")과 함께 붙어 운영팀 글임을 드러낸다
export function OperatorBadge({ className }: { className?: string }) {
  return (
    <span className={cn(chip, "bg-ink text-white", className)}>
      <ShieldCheck size={12} strokeWidth={2.4} />
      운영팀
    </span>
  );
}

// 첫 글 이벤트 기간에 쓴 회원의 첫 글
export function EventTag({ className }: { className?: string }) {
  return (
    <span className={cn(chip, "bg-[#FFF3DC] text-[#A86400]", className)}>
      <PartyPopper size={12} strokeWidth={2.2} />
      이벤트 참여
    </span>
  );
}

// 아직 게시 시각이 오지 않은 예약 글 (작성자에게만 보인다)
export function ScheduledTag({
  at,
  className,
}: {
  at: string;
  className?: string;
}) {
  return (
    <span className={cn(chip, "bg-[#E8F0FE] text-[#1A56DB]", className)}>
      <CalendarClock size={12} strokeWidth={2.2} />
      {formatPublishAt(at)} 게시 예정
    </span>
  );
}

// 신고로 숨긴 글·댓글 (작성자 본인에게만 보인다)
export function HiddenTag({ className }: { className?: string }) {
  return (
    <span className={cn(chip, "bg-[#FDECEA] text-soon", className)}>
      <EyeOff size={12} strokeWidth={2.2} />
      숨김
    </span>
  );
}

// 글 상세 위 안내. 신고한 사람은 알려주지 않는다
export function HiddenNotice({ state }: { state: Exclude<HiddenState, null> }) {
  return (
    <p className="mb-4 rounded-[12px] bg-[#FDECEA] px-3.5 py-3 text-[13px] leading-[1.55] text-[#B42318]">
      {state === "REVIEWING"
        ? "신고가 여러 건 접수돼 운영팀이 검토하는 동안 이 글을 숨겼어요. 지금은 나에게만 보이고, 검토가 끝나면 알림으로 알려드려요."
        : "운영 정책에 따라 이 글을 숨겼어요. 지금은 나에게만 보여요. 문의는 고객센터 1:1 문의로 남겨주세요."}
    </p>
  );
}
