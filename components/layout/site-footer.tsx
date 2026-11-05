import Link from "next/link";

import { Container } from "./container";

export function SiteFooter() {
  return (
    <footer className="mt-1.5 border-t border-[#E8E8E6] pt-[22px] pb-[26px] md:mt-[90px] md:pt-7 md:pb-10">
      <Container>
        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-[13px] font-semibold text-[#444] md:gap-x-6">
          <Link href="/help?tab=notice">공지사항</Link>
          <Link href="/help">고객센터</Link>
          <Link href="/terms">이용약관</Link>
          <Link href="/privacy" className="font-extrabold text-ink">
            개인정보처리방침
          </Link>
          <Link href="/help?tab=inquiry&type=PARTNER">광고·제휴 문의</Link>
        </nav>
        <p className="mt-3.5 text-xs leading-[1.75] text-faint md:mt-4 md:text-[12.5px] md:leading-[1.8]">
          롬(ROM) · 운영자 권현우
          {/*
            사업자등록 후 아래 항목을 이 자리에 추가한다.
            - 사업자등록번호 000-00-00000
            - 통신판매업 신고 제0000-OO-0000호 (수강 신청 연결 등 유료 거래를 시작할 때)
            - 사업장 주소
            예) <span className="hidden md:inline"> · </span>사업자등록번호 000-00-00000
          */}
          <br />
          문의는{" "}
          <Link href="/help?tab=inquiry" className="underline underline-offset-2 hover:text-ink">
            고객센터 1:1 문의
          </Link>
          로 남겨주세요
          <br />© 2026 롬(ROM). All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
