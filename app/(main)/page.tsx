import { AlertCta } from "@/components/layout/alert-cta";
import { Container } from "@/components/layout/container";
import { SiteHeader } from "@/components/layout/site-header";
import { HeroSearch } from "@/components/home/hero-search";
import { NoticeStrip } from "@/components/home/notice-strip";
import { PromoBanner } from "@/components/home/promo-banner";
import { HotPostsBox, LatestPostsSection, TopReviewedSeminars } from "@/components/home/community-sections";
import { CeCourseSection, PrivateEducationSection } from "@/components/home/seminar-sections";
import { banners } from "@/lib/seminars";

export default function Home() {
  return (
    <>
      <NoticeStrip />
      <SiteHeader />
      <main>
        <HeroSearch />

        {/* 보수교육 + 후기 많은 세미나 */}
        <Container className="mt-[30px] md:mt-[56px]">
          <div className="flex flex-col gap-[30px] md:grid md:grid-cols-[minmax(0,1fr)_334px] md:items-start md:gap-10">
            <CeCourseSection />
            <TopReviewedSeminars />
          </div>
        </Container>

        <Container className="mt-[30px] md:mt-[52px]">
          <PromoBanner banners={banners} />
        </Container>

        {/* 커뮤니티 최신글 + 커뮤니티 인기글 */}
        <Container className="mt-[38px] md:mt-14">
          <div className="flex flex-col gap-[30px] md:grid md:grid-cols-[minmax(0,1fr)_334px] md:items-start md:gap-10">
            <LatestPostsSection />
            <HotPostsBox />
          </div>
        </Container>

        <PrivateEducationSection />

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
