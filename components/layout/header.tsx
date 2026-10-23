import Link from "next/link";
import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold tracking-tight text-primary">
            롬
          </span>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            물리치료 세미나·보수교육 한곳에서
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/alerts">
              <Bell />
              <span className="hidden sm:inline">알림 조건</span>
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/login">로그인</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
