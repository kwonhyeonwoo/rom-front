"use client";

import { useState } from "react";
import Form from "next/form";
import Link from "next/link";
import { ChevronLeft, Search, X } from "lucide-react";

import type { SearchFilters } from "@/lib/search";

// 검색어만 바꾸고 나머지 필터는 유지한다
function KeptFilters({ filters }: { filters: SearchFilters }) {
  const kept: [string, string | null][] = [
    ["region", filters.region],
    ["category", filters.category],
    ["period", filters.period],
    ["price", filters.price],
    ["weekend", filters.weekend ? "1" : null],
    ["credit", filters.credit ? "1" : null],
    ["closingSoon", filters.closingSoon ? "1" : null],
    ["sort", filters.sort === "deadline" ? null : filters.sort],
  ];
  return kept.map(([name, value]) => value && <input key={name} type="hidden" name={name} value={value} />);
}

export function HeaderSearchForm({ filters }: { filters: SearchFilters }) {
  return (
    <Form
      action="/search"
      className="flex h-[42px] w-[340px] items-center gap-2 rounded-full border border-[#DDD] px-4 text-[14.5px]"
    >
      <Search size={17} strokeWidth={2} className="shrink-0" />
      <input
        name="q"
        defaultValue={filters.q}
        aria-label="세미나 검색"
        placeholder="세미나명, 강사, 학회"
        className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-faint"
      />
      <KeptFilters filters={filters} />
    </Form>
  );
}

export function MobileSearchHeader({ filters }: { filters: SearchFilters }) {
  const [query, setQuery] = useState(filters.q);

  return (
    <div className="flex h-[60px] items-center gap-2.5 px-4 md:hidden">
      <Link href="/" aria-label="뒤로 가기" className="shrink-0">
        <ChevronLeft size={24} strokeWidth={2} />
      </Link>
      <Form
        action="/search"
        className="flex h-11 flex-1 items-center justify-between rounded-full border border-[#DDD] px-4 text-[15px]"
      >
        <input
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="세미나 검색"
          placeholder="세미나명, 강사, 학회 검색"
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-faint"
        />
        <KeptFilters filters={filters} />
        {query && (
          <button type="button" aria-label="검색어 지우기" onClick={() => setQuery("")} className="text-faint">
            <X size={18} strokeWidth={2} />
          </button>
        )}
      </Form>
    </div>
  );
}
