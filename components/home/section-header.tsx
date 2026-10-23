import Link from "next/link";

export function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between pb-4 md:pb-[18px]">
      <h2 className="text-xl font-extrabold tracking-[-0.04em] md:text-2xl">{title}</h2>
      <Link href={href} className="text-[13px] font-semibold text-sub hover:text-ink">
        전체보기 ›
      </Link>
    </div>
  );
}
