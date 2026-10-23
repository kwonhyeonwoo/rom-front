import Form from "next/form";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

const quickFilters = [
  { label: "이번 주말", href: "/search?weekend=1" },
  { label: "보수교육 인정", href: "/search?credit=1" },
  { label: "마감 임박", href: "/search?sort=deadline" },
  { label: "무료", href: "/search?price=free" },
  { label: "온라인", href: "/search?region=온라인" },
  { label: "서울", href: "/search?region=서울" },
  { label: "경기", href: "/search?region=경기" },
];

export function HeroSearch() {
  return (
    <section className="px-5 pt-[30px] md:mx-auto md:max-w-[1240px] md:pt-[76px] md:text-center">
      <h1 className="text-[28px] leading-[1.25] font-extrabold tracking-[-0.05em] md:text-[46px] md:leading-[1.2]">
        물리치료 세미나,
        <br />
        한곳에서 찾으세요
      </h1>
      <p className="mt-4 hidden text-[17.5px] text-sub md:block">
        학회·협회·교육업체에 흩어진 세미나와 보수교육을 매일 모아드려요
      </p>

      <Form
        action="/search"
        className="mt-5 flex h-[54px] items-center gap-2.5 rounded-full border border-[#DEDEDE] pr-1.5 pl-[18px] shadow-[0_4px_18px_rgba(0,0,0,.06)] md:mx-auto md:mt-[34px] md:h-[62px] md:w-[720px] md:gap-3 md:pr-2 md:pl-6 md:shadow-[0_6px_28px_rgba(0,0,0,.07)]"
      >
        <Search className="size-5 shrink-0 md:size-[21px]" strokeWidth={2} />
        <input
          name="q"
          aria-label="세미나 검색"
          placeholder="세미나명, 강사, 학회로 검색해보세요"
          className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-faint md:text-[16.5px]"
        />
        <button
          type="submit"
          aria-label="검색"
          className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-ink text-white md:size-[46px]"
        >
          <ArrowRight size={20} strokeWidth={2.2} />
        </button>
      </Form>

      <div className="-mx-5 mt-3.5 flex gap-[7px] overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:mt-5 md:justify-center md:gap-2 md:px-0">
        {quickFilters.map((filter) => (
          <Link
            key={filter.label}
            href={filter.href}
            className="inline-flex h-8 shrink-0 items-center rounded-full border border-[#E4E4E4] bg-white px-[13px] text-[13px] font-medium whitespace-nowrap text-[#333] hover:border-ink md:h-[34px] md:px-3.5 md:text-[13.5px]"
          >
            {filter.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
