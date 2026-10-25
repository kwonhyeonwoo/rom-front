"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import {
  categoryOptions,
  periodOptions,
  priceOptions,
  regionOptions,
  type SearchFilters,
} from "@/lib/search";
import { SelectPill, TogglePill, pillClass } from "./filter-pill";
import { useFilterNavigation } from "./use-filter-navigation";

export function FilterBar({ filters }: { filters: SearchFilters }) {
  const navigate = useFilterNavigation(filters);
  // 모바일은 한 줄에 다 안 들어가서 토글 필터를 접어 둔다
  const [showToggles, setShowToggles] = useState(false);

  const toggles = (
    <>
      <TogglePill label="주말만" on={filters.weekend} onClick={() => navigate({ weekend: !filters.weekend })} />
      {/* 보수교육 인정과 사설 세미나는 서로 반대 조건이라 하나만 켠다 */}
      <TogglePill
        label="보수교육 인정"
        on={filters.credit}
        onClick={() => navigate({ credit: !filters.credit, privateOnly: false })}
      />
      <TogglePill
        label="세미나교육"
        on={filters.privateOnly}
        onClick={() => navigate({ privateOnly: !filters.privateOnly, credit: false })}
      />
      <TogglePill
        label="마감 임박"
        on={filters.closingSoon}
        onClick={() => navigate({ closingSoon: !filters.closingSoon })}
      />
    </>
  );

  return (
    <div>
      <div className="-mx-4 flex items-center gap-[7px] overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:gap-2 md:overflow-visible md:px-0">
        <button
          type="button"
          aria-label="필터 더보기"
          aria-expanded={showToggles}
          data-on={showToggles}
          onClick={() => setShowToggles((open) => !open)}
          className={`${pillClass} px-3 md:hidden`}
        >
          <SlidersHorizontal size={17} strokeWidth={2} />
        </button>
        <SelectPill
          label="지역"
          value={filters.region}
          options={regionOptions}
          onChange={(region) => navigate({ region })}
        />
        <SelectPill
          label="분야"
          value={filters.category}
          options={categoryOptions}
          onChange={(category) => navigate({ category })}
        />
        <SelectPill label="날짜" value={filters.period} options={periodOptions} onChange={(period) => navigate({ period })} />
        <SelectPill label="가격" value={filters.price} options={priceOptions} onChange={(price) => navigate({ price })} />
        <div className="hidden items-center gap-2 md:flex">{toggles}</div>
        <button
          type="button"
          onClick={() =>
            navigate({
              region: null,
              category: null,
              period: null,
              price: null,
              weekend: false,
              credit: false,
              privateOnly: false,
              openOnly: false,
              closingSoon: false,
            })
          }
          className="ml-2 hidden text-[13.5px] whitespace-nowrap text-faint hover:text-ink md:inline"
        >
          초기화
        </button>
      </div>
      {showToggles && <div className="mt-2 flex flex-wrap gap-[7px] md:hidden">{toggles}</div>}
    </div>
  );
}
