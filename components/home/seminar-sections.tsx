"use client";

import { Container } from "@/components/layout/container";
import { SeminarCard } from "@/components/seminar/seminar-card";
import { SeminarListItem } from "@/components/seminar/seminar-list-item";
import { ListStatus } from "@/components/seminar/list-status";
import { useSeminarsQuery } from "@/hooks/queries/seminar/useSeminarsQuery";
import { defaultFilters } from "@/lib/search";
import { SectionHeader } from "./section-header";

const SECTION_SIZE = 4;

export function DeadlineSoonSection() {
  const { data, status } = useSeminarsQuery(
    { ...defaultFilters, closingSoon: true, sort: "deadline" },
    SECTION_SIZE,
  );
  const items = data?.items ?? [];
  console.log("data", data);
  return (
    <section className="mt-9 md:mt-[72px]">
      <Container>
        <SectionHeader title="마감 임박" href="/search?closingSoon=1" />
      </Container>
      {items.length === 0 ? (
        <Container>
          <ListStatus
            status={status}
            empty="7일 안에 신청이 마감되는 세미나가 없어요."
          />
        </Container>
      ) : (
        // 모바일은 가로 스크롤, PC는 4열 그리드
        <div className="flex snap-x scroll-px-5 gap-3.5 overflow-x-auto px-5 [scrollbar-width:none] md:mx-auto md:grid md:max-w-[1240px] md:grid-cols-4 md:gap-6 md:overflow-visible">
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

export function NewlyAddedSection() {
  const { data, status } = useSeminarsQuery(
    { ...defaultFilters, sort: "latest" },
    SECTION_SIZE,
  );
  const items = data?.items ?? [];

  return (
    <Container className="mt-[38px] md:mt-[72px]">
      <SectionHeader title="새로 올라온 세미나" href="/search?sort=latest" />
      {items.length === 0 ? (
        <ListStatus status={status} empty="아직 수집된 세미나가 없어요." />
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
