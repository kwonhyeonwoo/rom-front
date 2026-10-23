import { Suspense } from "react";

import { CategoryTabs } from "@/components/filter/category-tabs";
import { SearchBox } from "@/components/filter/search-box";
import {
  SeminarResults,
  SeminarResultsSkeleton,
} from "@/components/seminar/seminar-results";

export default function Home({ searchParams }: PageProps<"/">) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 lg:py-10">
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
            어떤 세미나를 찾고 있나요?
          </h1>
          <p className="text-sm text-muted-foreground lg:text-base">
            학회·협회·교육업체에 흩어진 세미나와 보수교육을 매일 모아드려요.
          </p>
        </div>
        <Suspense>
          <SearchBox />
          <CategoryTabs />
        </Suspense>
      </section>

      <Suspense fallback={<SeminarResultsSkeleton />}>
        <SeminarResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
