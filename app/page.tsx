import { AlertCta } from "@/components/layout/alert-cta";
import { Container } from "@/components/layout/container";
import { SiteHeader } from "@/components/layout/site-header";
import { HeroSearch } from "@/components/home/hero-search";
import { PromoBanner } from "@/components/home/promo-banner";
import { SectionHeader } from "@/components/home/section-header";
import { SeminarCard } from "@/components/seminar/seminar-card";
import { SeminarListItem } from "@/components/seminar/seminar-list-item";
import { banners, deadlineSoon, newlyAdded } from "@/lib/seminars";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSearch />

        <Container className="mt-[26px] md:mt-[60px]">
          <PromoBanner banners={banners} />
        </Container>

        <section className="mt-9 md:mt-[72px]">
          <Container>
            <SectionHeader title="마감 임박" href="/search?sort=deadline" />
          </Container>
          {/* 모바일은 가로 스크롤, PC는 4열 그리드 */}
          <div className="flex snap-x scroll-px-5 gap-3.5 overflow-x-auto px-5 [scrollbar-width:none] md:mx-auto md:grid md:max-w-[1240px] md:grid-cols-4 md:gap-6 md:overflow-visible">
            {deadlineSoon.map((seminar) => (
              <SeminarCard
                key={seminar.id}
                seminar={seminar}
                className="w-[238px] shrink-0 snap-start md:w-auto"
                thumbClassName="h-[186px] md:h-[220px]"
                posterClassName="max-md:scale-[0.83]"
              />
            ))}
          </div>
        </section>

        <Container className="mt-[38px] md:mt-[72px]">
          <SectionHeader title="새로 올라온 세미나" href="/search?sort=latest" />
          <div className="hidden grid-cols-4 gap-6 md:grid">
            {newlyAdded.map((seminar) => (
              <SeminarCard key={seminar.id} seminar={seminar} />
            ))}
          </div>
          <div className="-mt-4 md:hidden">
            {newlyAdded.map((seminar) => (
              <SeminarListItem key={seminar.id} seminar={seminar} />
            ))}
          </div>
        </Container>

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
