import Link from "next/link";
import { BellPlus } from "lucide-react";

import { Button } from "@/components/ui/button";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-12 text-center">
      <p className="font-semibold">조건에 맞는 세미나가 아직 없어요</p>
      <p className="text-sm text-muted-foreground">
        이 조건을 저장해두면 새 세미나가 올라올 때 알려드릴게요.
      </p>
      <Button asChild>
        <Link href="/alerts">
          <BellPlus />이 조건으로 알림 받기
        </Link>
      </Button>
    </div>
  );
}
