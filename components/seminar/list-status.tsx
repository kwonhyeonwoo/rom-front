import { cn } from "@/lib/utils";

// 목록을 불러오는 중이거나 실패했거나 비었을 때 보여줄 문구
export function ListStatus({
  status,
  empty,
  className,
}: {
  status: "pending" | "error" | "success";
  empty: string;
  className?: string;
}) {
  const message =
    status === "pending" ? "세미나를 불러오는 중이에요…" : status === "error" ? "세미나를 불러오지 못했어요. 잠시 후 다시 시도해주세요." : empty;
  return (
    <p role={status === "error" ? "alert" : undefined} className={cn("py-16 text-center text-[15px] text-sub", className)}>
      {message}
    </p>
  );
}
