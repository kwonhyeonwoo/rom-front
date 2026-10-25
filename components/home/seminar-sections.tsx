"use client";

import { Container } from "@/components/layout/container";
import { SeminarCard } from "@/components/seminar/seminar-card";
import { SeminarListItem } from "@/components/seminar/seminar-list-item";
import { SeminarCardSkeleton, SeminarListItemSkeleton, SkeletonList } from "@/components/seminar/seminar-skeleton";
import { ListStatus } from "@/components/seminar/list-status";
import { useSeminarsQuery } from "@/hooks/queries/seminar/useSeminarsQuery";
import { defaultFilters, type SearchFilters } from "@/lib/search";
import { SectionHeader } from "./section-header";

const SECTION_SIZE = 4;

// 보수교육 인정 교육. 교육일이 가까운 순
export function CeCourseSection() {
  return (
    <GridSection
      title="보수교육"
      description="협회 보수교육 평점이 인정되는 교육"
      href="/search?credit=1&sort=date"
      filters={{ credit: true, sort: "date" }}
      empty="다가오는 보수교육이 없어요."
    />
  );
}

// 학회·교육업체 사설 세미나 (보수교육 인정이 아니거나 확인되지 않은 것). 신청이 끝난 것은 뺀다
export function PrivateSeminarSection() {
  return (
    <GridSection
      title="세미나교육"
      description="학회·교육업체가 여는 도수·운동·재활 세미나"
      href="/search?private=1&open=1&sort=date"
      filters={{ privateOnly: true, openOnly: true, sort: "date" }}
      empty="다가오는 세미나가 없어요."
    />
  );
}

// PC는 4열 카드, 모바일은 세로 목록
function GridSection({
  title,
  description,
  href,
  filters,
  empty,
}: {
  title: string;
  description: string;
  href: string;
  filters: Partial<SearchFilters>;
  empty: string;
}) {
  const { data, status } = useSeminarsQuery({ ...defaultFilters, ...filters }, SECTION_SIZE);
  const items = data?.items ?? [];

  return (
    <Container className="mt-[38px] md:mt-[72px]">
      <SectionHeader title={title} description={description} href={href} />
      {status === "pending" ? (
        <>
          <div className="hidden grid-cols-4 gap-6 md:grid">
            <SkeletonList count={SECTION_SIZE} render={(index) => <SeminarCardSkeleton key={index} />} />
          </div>
          <div className="-mt-4 md:hidden">
            <SkeletonList count={3} render={(index) => <SeminarListItemSkeleton key={index} />} />
          </div>
        </>
      ) : items.length === 0 ? (
        <ListStatus status={status} empty={empty} />
      ) : (
        <>
          <div className="hidden grid-cols-4 gap-6 md:grid">
            {items.map((seminar) => (
              <SeminarCard key={seminar.id} seminar={seminar} />
            ))}
          </div>
          <div className="-mt-4 md:hidden">
            {items.map((seminar) => (
              <SeminarListItem key={seminar.id} seminar={seminar} />
            ))}
          </div>
        </>
      )}
    </Container>
  );
}

export function DeadlineSoonSection() {
  const { data, status } = useSeminarsQuery({ ...defaultFilters, closingSoon: true, sort: "deadline" }, SECTION_SIZE);
  const items = data?.items ?? [];
  const row =
    "flex snap-x scroll-px-5 gap-3.5 overflow-x-auto px-5 [scrollbar-width:none] md:mx-auto md:grid md:max-w-[1240px] md:grid-cols-4 md:gap-6 md:overflow-visible";

  return (
    <section className="mt-[38px] md:mt-[72px]">
      <Container>
        <SectionHeader title="마감 임박" description="7일 안에 신청이 마감돼요" href="/search?closingSoon=1" />
      </Container>
      {status === "pending" ? (
        <div className={row}>
          <SkeletonList
            count={SECTION_SIZE}
            render={(index) => (
              <SeminarCardSkeleton
                key={index}
                className="w-[238px] shrink-0 md:w-auto"
                thumbClassName="h-[186px] md:h-[220px]"
              />
            )}
          />
        </div>
      ) : items.length === 0 ? (
        <Container>
          <ListStatus status={status} empty="7일 안에 신청이 마감되는 세미나가 없어요." />
        </Container>
      ) : (
        // 모바일은 가로 스크롤, PC는 4열 그리드
        <div className={row}>
          {items.map((seminar) => (
            <SeminarCard
              key={seminar.id}
              seminar={seminar}
              className="w-[238px] shrink-0 snap-start md:w-auto"
              thumbClassName="h-[186px] md:h-[220px]"
              posterClassName="max-md:scale-[0.83]"
            />
          ))}
        </div>
      )}
    </section>
  );
}
