import { Suspense } from "react";
import type { Metadata } from "next";

import { AlertCta } from "@/components/layout/alert-cta";
import { Container } from "@/components/layout/container";
import { SiteHeader } from "@/components/layout/site-header";
import { HeaderSearchForm, MobileSearchHeader } from "@/components/search/search-form";
import { SearchResults } from "@/components/search/search-results";
import { parseFilters } from "@/lib/search";

export const metadata: Metadata = {
  title: "세미나 검색 · 롬",
};

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <Suspense fallback={<SearchFallback />}>
      {searchParams.then((params) => (
        <SearchPageContent params={params} />
      ))}
    </Suspense>
  );
}

function SearchPageContent({ params }: { params: Record<string, string | string[] | undefined> }) {
  const filters = parseFilters(params);
  const alertLabel = [filters.q, filters.region].filter(Boolean).join(" · ");

  return (
    <>
      <SiteHeader hideOnMobile searchSlot={<HeaderSearchForm filters={filters} />} />
      <MobileSearchHeader filters={filters} />
      <main>
        <SearchResults filters={filters} />

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
      <Container className="pt-11" aria-busy>
        <div className="skeleton h-9 w-72 rounded-lg" />
        <div className="skeleton mt-6 h-[38px] w-full max-w-[640px] rounded-full" />
        <div className="mt-[34px] grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="skeleton h-[269px] rounded-[14px]" />
          ))}
        </div>
      </Container>
    </>
  );
}
