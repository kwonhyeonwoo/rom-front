"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useFilterParams } from "@/components/filter/use-filter-params";

export function SearchBox() {
  const { searchParams, setParam } = useFilterParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  return (
    <form
      role="search"
      className="relative"
      onSubmit={(e) => {
        e.preventDefault();
        setParam("q", value.trim() || null);
      }}
    >
      <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="세미나명, 강사, 학회로 검색"
        className="h-12 rounded-xl bg-card pl-10 text-base shadow-sm"
      />
    </form>
  );
}
