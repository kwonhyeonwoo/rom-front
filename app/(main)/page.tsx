import { AlertCta } from "@/components/layout/alert-cta";
import { Container } from "@/components/layout/container";
import { SiteHeader } from "@/components/layout/site-header";
import { HeroSearch } from "@/components/home/hero-search";
import { PromoBanner } from "@/components/home/promo-banner";
import { CeCourseSection, DeadlineSoonSection, PrivateSeminarSection } from "@/components/home/seminar-sections";
import { banners } from "@/lib/seminars";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSearch />

        <Container className="mt-[26px] md:mt-[60px]">
          <PromoBanner banners={banners} />
        </Container>

        <CeCourseSection />
        <PrivateSeminarSection />
        <DeadlineSoonSection />

        <Container className="mt-[18px] mb-[30px] md:mt-20 md:mb-0">
          <AlertCta
            title="원하는 조건을 저장해두세요"
            description="'요추 도수 · 대구 · 주말'처럼 저장하면 새 세미나가 올라올 때 알려드려요"
            mobileDescription="새 세미나가 올라오면 알려드려요"
            action="알림 조건 만들기"
          />
        </Container>
      </main>
    </>
  );
}
