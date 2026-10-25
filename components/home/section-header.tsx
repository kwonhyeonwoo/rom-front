import Link from "next/link";

export function SectionHeader({ title, description, href }: { title: string; description?: string; href: string }) {
  return (
    <div className="flex items-end justify-between gap-4 pb-4 md:pb-[18px]">
      <div className="min-w-0">
        <h2 className="text-xl font-extrabold tracking-[-0.04em] md:text-2xl">{title}</h2>
        {description && <p className="mt-0.5 truncate text-[13px] text-sub md:mt-1 md:text-[14.5px]">{description}</p>}
      </div>
      <Link href={href} className="shrink-0 text-[13px] font-semibold text-sub hover:text-ink">
        전체보기 ›
      </Link>
    </div>
  );
}
