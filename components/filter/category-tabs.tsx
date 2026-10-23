"use client";

import { useFilterParams } from "@/components/filter/use-filter-params";
import { CATEGORY_LABELS } from "@/lib/constants/seminar";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/seminar";

const CATEGORIES = Object.entries(CATEGORY_LABELS) as [Category, string][];

export function CategoryTabs() {
  const { searchParams, setParam } = useFilterParams();
  const current = searchParams.get("category");

  const items: [Category | null, string][] = [[null, "전체"], ...CATEGORIES];

  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none]">
      {items.map(([value, label]) => {
        const active = current === value || (!current && value === null);
        return (
          <button
            key={label}
            type="button"
            onClick={() => setParam("category", value)}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
