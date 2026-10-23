"use client";

import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFilterParams } from "@/components/filter/use-filter-params";
import { PRICE_RANGES, REGION_LABELS } from "@/lib/constants/seminar";
import { cn } from "@/lib/utils";

function ToggleChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "h-9 shrink-0 rounded-lg border px-3 text-sm font-medium transition-colors lg:w-full lg:text-left",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "bg-card text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

const selectClass =
  "h-9 shrink-0 rounded-lg border bg-card px-3 text-sm font-medium text-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 lg:w-full";

export function FilterOptions() {
  const { searchParams, setParam, reset } = useFilterParams();
  const weekend = searchParams.get("weekend") === "1";
  const credits = searchParams.get("credits") === "1";
  const hasFilter = searchParams.size > 0;

  return (
    <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:items-stretch lg:gap-3 lg:overflow-visible lg:px-0">
      <p className="hidden text-sm font-bold lg:block">상세 필터</p>
      <select
        aria-label="지역"
        className={selectClass}
        value={searchParams.get("region") ?? ""}
        onChange={(e) => setParam("region", e.target.value || null)}
      >
        <option value="">전국</option>
        {Object.entries(REGION_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <select
        aria-label="가격대"
        className={selectClass}
        value={searchParams.get("price") ?? ""}
        onChange={(e) => setParam("price", e.target.value || null)}
      >
        <option value="">가격 전체</option>
        {PRICE_RANGES.map((range) => (
          <option key={range.value} value={range.value}>
            {range.label}
          </option>
        ))}
      </select>
      <ToggleChip active={weekend} onClick={() => setParam("weekend", weekend ? null : "1")}>
        주말만
      </ToggleChip>
      <ToggleChip active={credits} onClick={() => setParam("credits", credits ? null : "1")}>
        보수교육 인정만
      </ToggleChip>
      {hasFilter && (
        <Button variant="ghost" size="sm" onClick={reset} className="shrink-0 text-muted-foreground lg:justify-start">
          <RotateCcw />
          초기화
        </Button>
      )}
    </div>
  );
}
