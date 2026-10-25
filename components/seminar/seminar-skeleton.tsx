import { cn } from "@/lib/utils";

// SeminarCard와 같은 크기의 로딩 자리
export function SeminarCardSkeleton({ thumbClassName, className }: { thumbClassName?: string; className?: string }) {
  return (
    <div aria-hidden className={cn("min-w-0", className)}>
      <div className={cn("skeleton h-[220px] rounded-[14px]", thumbClassName)} />
      <div className="flex flex-col gap-2 px-0.5 pt-3">
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-32 rounded" />
        <div className="mt-1 flex items-center justify-between">
          <div className="skeleton h-4 w-20 rounded" />
          <div className="skeleton h-3 w-16 rounded" />
        </div>
      </div>
    </div>
  );
}

// SeminarListItem과 같은 크기의 로딩 자리
export function SeminarListItemSkeleton({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex items-start gap-3.5 border-b border-line py-4 last:border-b-0", className)}>
      <div className="skeleton h-[101px] w-[76px] shrink-0 rounded-[10px]" />
      <div className="flex min-w-0 flex-1 flex-col gap-2 pt-0.5">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-3 w-28 rounded" />
        <div className="mt-1.5 flex items-center justify-between">
          <div className="skeleton h-4 w-24 rounded" />
          <div className="skeleton h-3 w-10 rounded" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonList({
  count,
  render,
}: {
  count: number;
  render: (index: number) => React.ReactNode;
}) {
  return (
    <>
      <span className="sr-only" role="status">
        세미나를 불러오는 중
      </span>
      {Array.from({ length: count }, (_, index) => render(index))}
    </>
  );
}
