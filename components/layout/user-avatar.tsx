import { cn } from "@/lib/utils";

// 프로필 사진이 없으면 이름 첫 글자를 보여준다
export function UserAvatar({ name, src, className }: { name: string; src?: string | null; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand text-sm font-bold text-white",
        className,
      )}
    >
      {src ? (
        // 구글 프로필 이미지는 도메인이 여러 개라 next/image 대신 img를 쓴다
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" referrerPolicy="no-referrer" className="size-full object-cover" />
      ) : (
        name.slice(0, 1)
      )}
    </span>
  );
}
