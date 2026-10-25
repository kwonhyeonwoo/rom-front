import { formatPrice, type Seminar } from "@/lib/seminars";
import { cn } from "@/lib/utils";
import { DDay } from "./dday";
import { Credit, SeminarLink } from "./seminar-card";
import { SeminarPoster } from "./seminar-poster";

// 포스터가 왼쪽에 있는 가로형 목록 아이템 (모바일)
export function SeminarListItem({ seminar, className }: { seminar: Seminar; className?: string }) {
  return (
    <article className={cn("flex items-start gap-3.5 border-b border-line py-4 last:border-b-0", className)}>
      <div className="shrink-0 overflow-hidden rounded-[10px]">
        <SeminarPoster poster={seminar.poster} width={76} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <span className="truncate text-xs text-sub">{seminar.host}</span>
        <h3 className="line-clamp-2 text-[15px] leading-[1.38] font-bold tracking-[-0.03em]">
          <SeminarLink seminar={seminar} />
        </h3>
        <span className="text-[12.5px] text-sub">
          {seminar.schedule} · {seminar.city}
        </span>
        <div className="mt-[5px] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <b className="text-[14.5px]">{formatPrice(seminar.price)}</b>
            <Credit seminar={seminar} />
          </span>
          <DDay dday={seminar.dday} soon={seminar.closingSoon} className="text-[12.5px]" />
        </div>
      </div>
    </article>
  );
}
