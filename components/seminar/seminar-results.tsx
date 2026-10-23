import { FilterOptions } from "@/components/filter/filter-options";
import { DeadlineSoonSection } from "@/components/seminar/deadline-soon-section";
import { EmptyState } from "@/components/seminar/empty-state";
import { SeminarCard } from "@/components/seminar/seminar-card";
import { MOCK_SEMINARS } from "@/lib/mock/seminars";
import {
  daysUntil,
  filterSeminars,
  isDeadlineSoon,
  parseFilters,
} from "@/lib/seminar";

type SearchParams = Record<string, string | string[] | undefined>;

export async function SeminarResults({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const filters = parseFilters(await searchParams);

  // TODO: NestJS API 연결 시 getSeminars(filters)로 교체
  const open = MOCK_SEMINARS.filter(
    (s) => !s.applyDeadline || daysUntil(s.applyDeadline) >= 0
  );
  const seminars = filterSeminars(open, filters).sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
  );
  const deadlineSoon = open
    .filter((s) => isDeadlineSoon(s))
    .sort(
      (a, b) =>
        new Date(a.applyDeadline!).getTime() - new Date(b.applyDeadline!).getTime()
    );

  return (
    <>
      {!filters.q && !filters.category && (
        <DeadlineSoonSection seminars={deadlineSoon} />
      )}

      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[220px_1fr] lg:items-start lg:gap-8">
        <aside className="lg:sticky lg:top-20 lg:rounded-xl lg:border lg:bg-card lg:p-4">
          <FilterOptions />
        </aside>

        <section className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            모집 중인 세미나{" "}
            <strong className="text-foreground">{seminars.length}</strong>개
          </p>
          {seminars.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {seminars.map((seminar) => (
                <SeminarCard key={seminar.id} seminar={seminar} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </section>
      </div>
    </>
  );
}

export function SeminarResultsSkeleton() {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:ml-[252px]">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-40 animate-pulse rounded-xl border bg-card" />
      ))}
    </div>
  );
}
