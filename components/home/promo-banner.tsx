"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { SeminarPoster } from "@/components/seminar/seminar-poster";
import type { Banner } from "@/lib/seminars";
import { cn } from "@/lib/utils";

// 교육업체 상단 노출 광고 배너
export function PromoBanner({ banners, className }: { banners: Banner[]; className?: string }) {
  const [index, setIndex] = useState(0);
  const banner = banners[index];
  const move = (step: number) => setIndex((current) => (current + step + banners.length) % banners.length);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="추천 세미나 광고"
      className={cn(
        "relative h-[156px] overflow-hidden rounded-[18px] text-white transition-colors md:h-[230px] md:rounded-[22px]",
        className,
      )}
      style={{ background: banner.background }}
    >
      <div className="absolute inset-y-0 left-[21px] flex flex-col justify-center gap-[5px] md:left-[41px] md:gap-[9px]">
        <span className="text-[6.4px] font-bold tracking-[.14em] text-[#8FE3C8] md:text-[12.6px]">{banner.eyebrow}</span>
        <span className="text-[17.4px] leading-[1.2] font-extrabold tracking-[-0.04em] md:text-[34.5px]">
          {banner.title[0]}
          <br />
          {banner.title[1]}
        </span>
        <span className="text-[7.5px] opacity-75 md:text-[15px]">{banner.meta}</span>
      </div>

      <div className="absolute top-[25px] right-[26px] rotate-3 overflow-hidden rounded-md shadow-[0_8px_24px_rgba(0,0,0,.3)] md:top-[37px] md:right-[220px]">
        <div className="md:hidden">
          <SeminarPoster poster={banner.poster} width={94} />
        </div>
        <div className="hidden md:block">
          <SeminarPoster poster={banner.poster} width={138} />
        </div>
      </div>

      <span className="absolute top-2 right-[9px] text-[6px] font-semibold opacity-60 md:top-4 md:right-[18px] md:text-xs">
        광고 · {banner.advertiser}
      </span>

      <div className="absolute bottom-2 left-[9px] flex items-center gap-2 rounded-full bg-black/40 px-[11px] py-[3px] text-[9.8px] font-semibold md:right-[18px] md:bottom-4 md:left-auto md:text-[13.2px]">
        <button type="button" aria-label="이전 광고" onClick={() => move(-1)}>
          <ChevronLeft size={12} strokeWidth={2.6} />
        </button>
        <span aria-live="polite">
          {index + 1} / {banners.length}
        </span>
        <button type="button" aria-label="다음 광고" onClick={() => move(1)}>
          <ChevronRight size={12} strokeWidth={2.6} />
        </button>
      </div>
    </section>
  );
}
