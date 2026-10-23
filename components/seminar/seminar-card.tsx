import Link from "next/link";
import { Calendar, MapPin, Monitor } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CATEGORY_LABELS, REGION_LABELS } from "@/lib/constants/seminar";
import {
  daysUntil,
  formatPrice,
  formatSeminarDate,
  isDeadlineSoon,
} from "@/lib/seminar";
import { cn } from "@/lib/utils";
import type { Seminar } from "@/types/seminar";

export function DeadlineBadge({ seminar }: { seminar: Seminar }) {
  if (!seminar.applyDeadline) return null;
  const days = daysUntil(seminar.applyDeadline);
  if (days < 0) return <Badge variant="secondary">마감</Badge>;

  const soon = isDeadlineSoon(seminar);
  return (
    <Badge
      variant="outline"
      className={cn(
        soon && "border-red-200 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400"
      )}
    >
      {days === 0 ? "오늘 마감" : `마감 D-${days}`}
    </Badge>
  );
}

export function SeminarCard({ seminar }: { seminar: Seminar }) {
  const location =
    seminar.format === "ONLINE"
      ? "온라인"
      : seminar.region
        ? REGION_LABELS[seminar.region]
        : "장소 미정";

  return (
    <Link
      href={`/seminars/${seminar.id}`}
      className="group flex flex-col gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary">{CATEGORY_LABELS[seminar.category]}</Badge>
          {seminar.kptaCredits ? (
            <Badge
              variant="outline"
              className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400"
            >
              보수교육 {seminar.kptaCredits}평점
            </Badge>
          ) : null}
        </div>
        <DeadlineBadge seminar={seminar} />
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="line-clamp-2 font-semibold leading-snug group-hover:text-primary">
          {seminar.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {seminar.provider}
          {seminar.instructors.length > 0 && ` · ${seminar.instructors.join(", ")}`}
        </p>
      </div>

      <div className="mt-auto flex items-end justify-between gap-2 text-sm">
        <div className="flex flex-col gap-1 text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            {formatSeminarDate(seminar.startAt, seminar.endAt)}
          </span>
          <span className="flex items-center gap-1.5">
            {seminar.format === "ONLINE" ? (
              <Monitor className="size-3.5" />
            ) : (
              <MapPin className="size-3.5" />
            )}
            {location}
          </span>
        </div>
        <span className="text-base font-bold">{formatPrice(seminar.price)}</span>
      </div>
    </Link>
  );
}
