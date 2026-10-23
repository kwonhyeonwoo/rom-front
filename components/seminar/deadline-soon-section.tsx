import Link from "next/link";
import { Flame } from "lucide-react";

import { DeadlineBadge } from "@/components/seminar/seminar-card";
import { formatSeminarDate } from "@/lib/seminar";
import type { Seminar } from "@/types/seminar";

export function DeadlineSoonSection({ seminars }: { seminars: Seminar[] }) {
  if (seminars.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="flex items-center gap-1.5 text-base font-bold">
        <Flame className="size-4 text-red-500" />
        마감 임박
      </h2>
      <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        {seminars.map((seminar) => (
          <Link
            key={seminar.id}
            href={`/seminars/${seminar.id}`}
            className="flex w-64 shrink-0 snap-start flex-col gap-2 rounded-xl border border-red-100 bg-red-50/50 p-3 transition-colors hover:border-red-200 dark:border-red-950 dark:bg-red-950/20"
          >
            <DeadlineBadge seminar={seminar} />
            <p className="line-clamp-2 text-sm font-semibold leading-snug">
              {seminar.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatSeminarDate(seminar.startAt, seminar.endAt)} · {seminar.provider}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
