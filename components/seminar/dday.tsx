import { cn } from "@/lib/utils";

// soon은 서버가 내려준 마감 임박(7일 이내) 여부
export function DDay({ dday, soon, className }: { dday: number | null; soon: boolean; className?: string }) {
  if (dday === null) return null;
  return (
    <span className={cn("whitespace-nowrap", soon ? "font-bold text-soon" : "font-semibold text-sub", className)}>
      {dday > 0 ? `D-${dday}` : dday === 0 ? "D-Day" : "마감"}
    </span>
  );
}
