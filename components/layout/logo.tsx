import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="롬 홈" className={cn("text-[28px] font-black tracking-[-0.07em] text-ink", className)}>
      롬<span className="text-brand">.</span>
    </Link>
  );
}
