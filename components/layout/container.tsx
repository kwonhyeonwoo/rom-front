import { cn } from "@/lib/utils";

// PC 기준 콘텐츠 폭 1200px, 좁은 화면에서는 좌우 20px 여백
export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-[1240px] px-5", className)} {...props} />;
}
