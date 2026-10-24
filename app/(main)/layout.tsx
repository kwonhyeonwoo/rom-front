import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { SiteFooter } from "@/components/layout/site-footer";

// 헤더·푸터·하단 탭바가 있는 일반 페이지 (로그인·회원가입은 (auth) 그룹에서 제외)
export default function MainLayout({ children }: LayoutProps<"/">) {
  return (
    // 모바일 하단 탭바 높이만큼 아래 여백
    <div className="flex flex-1 flex-col pb-[76px] md:pb-0">
      <div className="flex-1">{children}</div>
      <SiteFooter />
      <MobileTabBar />
    </div>
  );
}
