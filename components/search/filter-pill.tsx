"use client";

import { DropdownMenu } from "radix-ui";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export const pillClass =
  "inline-flex h-9 shrink-0 items-center gap-[5px] rounded-full border border-[#E4E4E4] bg-white px-4 text-[13.5px] font-medium whitespace-nowrap text-[#333] transition-colors hover:border-ink md:h-[38px] md:text-sm data-[on=true]:border-ink data-[on=true]:bg-ink data-[on=true]:text-white";

export function TogglePill({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={on} data-on={on} onClick={onClick} className={pillClass}>
      {label}
    </button>
  );
}

// 선택지가 있는 필터. 선택되면 선택값을 라벨로 보여준다.
export function SelectPill({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | null;
  options: readonly { value: string; label: string }[];
  onChange: (value: string | null) => void;
}) {
  const selected = options.find((option) => option.value === value);

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger data-on={!!selected} className={pillClass}>
        {selected?.label ?? label}
        <ChevronDown size={14} strokeWidth={2.2} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={6}
          className="z-50 min-w-[160px] rounded-xl border border-[#EEE] bg-white p-1.5 text-sm shadow-[0_8px_28px_rgba(0,0,0,.1)]"
        >
          <MenuItem active={!selected} onSelect={() => onChange(null)}>
            전체
          </MenuItem>
          {options.map((option) => (
            <MenuItem key={option.value} active={option.value === value} onSelect={() => onChange(option.value)}>
              {option.label}
            </MenuItem>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function MenuItem({
  active,
  onSelect,
  children,
}: {
  active: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <DropdownMenu.Item
      onSelect={onSelect}
      className={cn(
        "flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 outline-none data-highlighted:bg-surface",
        active && "font-bold",
      )}
    >
      {children}
      {active && <Check size={14} />}
    </DropdownMenu.Item>
  );
}
