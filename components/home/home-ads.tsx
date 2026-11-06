import { cacheLife } from "next/cache";

import { PromoBanner } from "@/components/home/promo-banner";
import { activeAds } from "@/lib/ads";

// 마감일이 지난 광고가 빠지도록 날짜 기준 필터를 서버에서 한 시간마다 다시 계산한다
export async function HomeAds() {
  "use cache";
  cacheLife("hours");
  return <PromoBanner banners={activeAds()} />;
}
