import { Suspense } from "react";
import type { Metadata } from "next";

import { AlertCta } from "@/components/layout/alert-cta";
import { Container } from "@/components/layout/container";
import { SiteHeader } from "@/components/layout/site-header";
import { FilterBar } from "@/components/search/filter-bar";
import { Pagination } from "@/components/search/pagination";
import { HeaderSearchForm, MobileSearchHeader } from "@/components/search/search-form";
import { SortMenu } from "@/components/search/sort-menu";
import { SeminarCard } from "@/components/seminar/seminar-card";
import { SeminarListItem } from "@/components/seminar/seminar-list-item";
import { parseFilters, searchSeminars } from "@/lib/search";

export const metadata: Metadata = {
  title: "세미나 검색 · 롬",
};

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <Suspense fallback={<SearchFallback />}>
      {searchParams.then((params) => (
        <SearchResults params={params} />
      ))}
    </Suspense>
  );
}

function SearchResults({ params }: { params: Record<string, string | string[] | undefined> }) {
  const filters = parseFilters(params);
  const { total, page, totalPages, items } = searchSeminars(filters);
  const alertLabel = [filters.q, filters.region].filter(Boolean).join(" · ");

  return (
    <>
      <SiteHeader hideOnMobile searchSlot={<HeaderSearchForm filters={filters} />} />
      <MobileSearchHeader filters={filters} />
      <main>
        <Container className="max-md:px-4 md:pt-11">
          <div className="hidden items-center justify-between md:flex">
            <h1 className="text-[30px] font-extrabold tracking-[-0.045em]">
              {filters.q ? `'${filters.q}' 검색 결과 ` : "전체 세미나 "}
              <span className="text-brand">{total}</span>건
            </h1>
            <SortMenu filters={filters} />
          </div>
          <div className="pt-1 pb-4 md:border-b md:border-[#EFEFEF] md:pt-6 md:pb-[30px]">
            <FilterBar filters={filters} />
          </div>
        </Container>

        <div className="flex items-center justify-between border-t border-line px-5 pt-4 text-[13.5px] md:hidden">
          <span className="text-sub">
            총 <b className="text-ink">{total}</b>건
          </span>
          <SortMenu filters={filters} />
        </div>

        <Container>
          {items.length === 0 ? (
            <p className="py-24 text-center text-[15px] text-sub">
              조건에 맞는 세미나가 없어요. 필터를 줄이거나 다른 검색어로 찾아보세요.
            </p>
          ) : (
            <>
              <div className="hidden grid-cols-3 gap-x-6 gap-y-10 pt-[34px] md:grid">
                {items.map((seminar) => (
                  <SeminarCard key={seminar.id} seminar={seminar} posterWidth={181} thumbClassName="h-[269px]" />
                ))}
              </div>
              <div className="md:hidden">
                {items.map((seminar) => (
                  <SeminarListItem key={seminar.id} seminar={seminar} className="last:border-b" />
                ))}
              </div>
            </>
          )}
          <Pagination filters={filters} page={page} totalPages={totalPages} />
        </Container>

        <Container className="mt-3 mb-7 md:hidden">
          <AlertCta
            title={alertLabel ? `'${alertLabel}' 알림 받기` : "이 조건으로 알림 받기"}
            description="새 세미나가 올라오면 바로 알려드려요"
            action="알림 받기"
            className="[&_h2]:text-[17px] [&_h2]:tracking-[-0.03em]"
          />
        </Container>
      </main>
    </>
  );
}

function SearchFallback() {
  return (
    <>
      <SiteHeader hideOnMobile />
      <Container className="animate-pulse pt-11" aria-busy>
        <div className="h-9 w-72 rounded-lg bg-surface" />
        <div className="mt-6 h-[38px] w-full max-w-[640px] rounded-full bg-surface" />
        <div className="mt-[34px] grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="h-[269px] rounded-[14px] bg-surface" />
          ))}
        </div>
      </Container>
    </>
  );
}
