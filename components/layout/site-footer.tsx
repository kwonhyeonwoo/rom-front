import Link from "next/link";

import { Container } from "./container";

export function SiteFooter() {
  return (
    <footer className="mt-1.5 border-t border-[#E8E8E6] pt-[22px] pb-[26px] md:mt-[90px] md:pt-7 md:pb-10">
      <Container>
        <nav className="flex gap-4 text-[13px] font-semibold text-[#444] md:gap-6">
          <Link href="/terms">이용약관</Link>
          <Link href="/privacy" className="font-extrabold text-ink">
            개인정보처리방침
          </Link>
          <Link href="/contact">광고·제휴 문의</Link>
        </nav>
        <p className="mt-3.5 text-xs leading-[1.75] text-faint md:mt-4 md:text-[12.5px] md:leading-[1.8]">
          롬 · 대표 홍길동<span className="md:hidden"><br /></span>
          <span className="hidden md:inline"> · </span>사업자등록번호 000-00-00000
          <span className="md:hidden"><br /></span>
          <span className="hidden md:inline"> · </span>통신판매업 신고 제0000-서울-0000호
          <br />
          서울특별시 OO구 OO로 000<span className="md:hidden"><br /></span>
          <span className="hidden md:inline"> · </span>contact@rom.example
          <br />© 2026 롬. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
