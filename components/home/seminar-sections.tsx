"use client";

import { Container } from "@/components/layout/container";
import { SeminarCard } from "@/components/seminar/seminar-card";
import { SeminarListItem } from "@/components/seminar/seminar-list-item";
import {
  SeminarCardSkeleton,
  SeminarListItemSkeleton,
  SkeletonList,
} from "@/components/seminar/seminar-skeleton";
import { ListStatus } from "@/components/seminar/list-status";
import { useSeminarsQuery } from "@/hooks/queries/seminar/useSeminarsQuery";
import { defaultFilters, type SearchFilters } from "@/lib/search";
import { SectionHeader } from "./section-header";

const SECTION_SIZE = 4;
const PRIVATE_SECTION_SIZE = 12;

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

// 민간교육: 민간교육 사이트(예: 신경조절움직임학회)에서 수집한 교육·자격과정 전체.
// 지난 교육도 포함해 최근 교육일 순으로 보여 주고, 전체 목록은 더보기에서 본다
export function PrivateEducationSection() {
  return (
    <GridSection
      title="민간교육"
      description="교육업체·학회가 직접 여는 민간 교육과 자격과정"
      href="/search?edu=1&past=1&sort=dateDesc"
      filters={{ privateEdu: true, includePast: true, sort: "dateDesc" }}
      empty="수집된 민간교육이 아직 없어요."
      size={PRIVATE_SECTION_SIZE}
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
  size = SECTION_SIZE,
}: {
  title: string;
  description: string;
  href: string;
  filters: Partial<SearchFilters>;
  empty: string;
  size?: number;
}) {
  const { data, status } = useSeminarsQuery(
    { ...defaultFilters, ...filters },
    size,
  );
  const items = data?.items ?? [];

  return (
    <Container className="mt-[38px] md:mt-[72px]">
      <SectionHeader title={title} description={description} href={href} />
      {status === "pending" ? (
        <>
          <div className="hidden grid-cols-4 gap-x-6 gap-y-10 md:grid">
            <SkeletonList
              count={size}
              render={(index) => <SeminarCardSkeleton key={index} />}
            />
          </div>
          <div className="-mt-4 md:hidden">
            <SkeletonList
              count={3}
              render={(index) => <SeminarListItemSkeleton key={index} />}
            />
          </div>
        </>
      ) : items.length === 0 ? (
        <ListStatus status={status} empty={empty} />
      ) : (
        <>
          <div className="hidden grid-cols-4 gap-x-6 gap-y-10 md:grid">
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
