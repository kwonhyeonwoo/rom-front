import Link from "next/link";

import { cn } from "@/lib/utils";

// "조건 저장 → 새 세미나 알림" 유도 배너
export function AlertCta({
  title,
  description,
  mobileDescription,
  action,
  href = "/alerts/new",
  className,
}: {
  title: string;
  description: string;
  mobileDescription?: string;
  action: string;
  href?: string;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[20px] bg-ink p-[22px] text-white md:flex md:items-center md:justify-between md:rounded-[26px] md:px-14 md:py-12",
        className,
      )}
    >
      <div>
        <h2 className="text-[19px] leading-[1.35] font-extrabold tracking-[-0.04em] md:text-[28px] md:leading-[1.3]">
          {title}
        </h2>
        <p className="mt-1.5 text-[13.5px] opacity-70 md:mt-2 md:text-base">
          {mobileDescription ? (
            <>
              <span className="md:hidden">{mobileDescription}</span>
              <span className="hidden md:inline">{description}</span>
            </>
          ) : (
            description
          )}
        </p>
      </div>
      <Link
        href={href}
        className="mt-4 flex h-11 items-center justify-center rounded-full bg-white text-[14.5px] font-bold text-ink md:mt-0 md:h-[52px] md:px-7 md:text-[15.5px]"
      >
        {action}
      </Link>
    </section>
  );
}
