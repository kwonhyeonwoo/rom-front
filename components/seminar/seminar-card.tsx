import { formatPrice, type Seminar } from "@/lib/seminars";
import { cn } from "@/lib/utils";
import { BookmarkButton } from "./bookmark-button";
import { DDay } from "./dday";
import { SeminarPoster } from "./seminar-poster";

// 포스터 썸네일이 위에 있는 세로형 카드 (PC 그리드, 모바일 가로 스크롤)
export function SeminarCard({
  seminar,
  posterWidth = 144,
  thumbClassName,
  posterClassName,
  className,
}: {
  seminar: Seminar;
  posterWidth?: number;
  thumbClassName?: string;
  posterClassName?: string;
  className?: string;
}) {
  return (
    <article className={cn("min-w-0", className)}>
      <div
        className={cn(
          "relative flex h-[220px] items-center justify-center overflow-hidden rounded-[14px] bg-surface",
          thumbClassName,
        )}
      >
        <div className={cn("overflow-hidden rounded-[3px] shadow-[0_4px_14px_rgba(0,0,0,.14)]", posterClassName)}>
          <SeminarPoster poster={seminar.poster} width={posterWidth} />
        </div>
        {seminar.dday !== null && (
          <span className="absolute top-2.5 left-2.5 flex h-6 items-center rounded-full bg-white px-[9px] text-[12.5px]">
            <DDay dday={seminar.dday} soon={seminar.closingSoon} />
          </span>
        )}
        <BookmarkButton seminarId={seminar.id} className="absolute top-2.5 right-2.5" />
      </div>
      <div className="flex flex-col gap-1 px-0.5 pt-3">
        <span className="truncate text-[12.5px] text-sub">{seminar.host}</span>
        <h3 className="line-clamp-2 min-h-11 text-base leading-[1.38] font-bold tracking-[-0.03em]">
          <SeminarLink seminar={seminar} />
        </h3>
        <span className="text-[13px] text-sub">
          {seminar.schedule} · {seminar.city}
        </span>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[15.5px] font-extrabold">{formatPrice(seminar.price)}</span>
          <Credit seminar={seminar} />
        </div>
      </div>
    </article>
  );
}

export function Credit({ seminar }: { seminar: Seminar }) {
  if (!seminar.ceRecognized && !seminar.credit) return null;
  return (
    <span className="text-[12.5px] font-semibold whitespace-nowrap text-brand">
      {seminar.credit ? `보수교육 ${seminar.credit}점` : "보수교육 인정"}
    </span>
  );
}

// 상세 페이지가 생기기 전까지 신청 페이지(없으면 원문)로 연결한다
export function SeminarLink({ seminar }: { seminar: Seminar }) {
  return (
    <a href={seminar.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
      {seminar.title}
    </a>
  );
}
