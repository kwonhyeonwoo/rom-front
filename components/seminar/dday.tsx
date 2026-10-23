import { isDeadlineSoon } from "@/lib/seminars";
import { cn } from "@/lib/utils";

export function DDay({ dday, className }: { dday: number; className?: string }) {
  const soon = isDeadlineSoon(dday);
  return (
    <span className={cn("whitespace-nowrap", soon ? "font-bold text-soon" : "font-semibold text-sub", className)}>
      {dday > 0 ? `D-${dday}` : dday === 0 ? "D-Day" : "마감"}
    </span>
  );
}
