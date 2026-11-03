import { cn } from "@/lib/utils";

// 프로필 사진은 쓰지 않고 이름의 첫 글자(성)를 원 안에 보여준다
export function UserAvatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand text-sm font-bold text-white",
        className,
      )}
    >
      {Array.from(name.trim())[0] ?? "회"}
    </span>
  );
}
