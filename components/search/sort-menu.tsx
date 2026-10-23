"use client";

import { DropdownMenu } from "radix-ui";
import { ChevronDown } from "lucide-react";

import { sortOptions, type SearchFilters } from "@/lib/search";
import { MenuItem } from "./filter-pill";
import { useFilterNavigation } from "./use-filter-navigation";

export function SortMenu({ filters }: { filters: SearchFilters }) {
  const navigate = useFilterNavigation(filters);
  const current = sortOptions.find((option) => option.value === filters.sort) ?? sortOptions[0];

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger className="flex items-center gap-[5px] text-[13.5px] font-semibold text-sub outline-none hover:text-ink md:text-sm">
        {current.label}
        <ChevronDown size={14} strokeWidth={2.2} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="z-50 min-w-[140px] rounded-xl border border-[#EEE] bg-white p-1.5 text-sm shadow-[0_8px_28px_rgba(0,0,0,.1)]"
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} active={option.value === filters.sort} onSelect={() => navigate({ sort: option.value })}>
              {option.label}
            </MenuItem>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
