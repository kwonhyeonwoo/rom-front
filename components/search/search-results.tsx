"use client";

import { SeminarCard } from "@/components/seminar/seminar-card";
import { SeminarListItem } from "@/components/seminar/seminar-list-item";
import { ListStatus } from "@/components/seminar/list-status";
import { SeminarCardSkeleton, SeminarListItemSkeleton, SkeletonList } from "@/components/seminar/seminar-skeleton";
import { Container } from "@/components/layout/container";
import { useSeminarsQuery } from "@/hooks/queries/seminar/useSeminarsQuery";
import type { SearchFilters } from "@/lib/search";
import { cn } from "@/lib/utils";
import { FilterBar } from "./filter-bar";
import { Pagination } from "./pagination";
import { SortMenu } from "./sort-menu";

export function SearchResults({ filters }: { filters: SearchFilters }) {
  const { data, status, isPlaceholderData } = useSeminarsQuery(filters);
  const total = data?.total ?? 0;
  const items = data?.items ?? [];

  return (
    <>
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

      <Container className={cn("transition-opacity", isPlaceholderData && "opacity-60")}>
        {status === "pending" ? (
          <>
            <div className="hidden grid-cols-3 gap-x-6 gap-y-10 pt-[34px] md:grid">
              <SkeletonList count={6} render={(index) => <SeminarCardSkeleton key={index} thumbClassName="h-[269px]" />} />
            </div>
            <div className="md:hidden">
              <SkeletonList count={5} render={(index) => <SeminarListItemSkeleton key={index} />} />
            </div>
          </>
        ) : items.length === 0 ? (
          <ListStatus
            status={status}
            empty="조건에 맞는 세미나가 없어요. 필터를 줄이거나 다른 검색어로 찾아보세요."
            className="py-24"
          />
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
        {data && <Pagination filters={filters} page={data.page} totalPages={data.totalPages} />}
      </Container>
    </>
  );
}
