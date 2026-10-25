"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Bookmark, ChevronRight, LogOut, MessageSquareText } from "lucide-react";

import { AlertCta } from "@/components/layout/alert-cta";
import { Container } from "@/components/layout/container";
import { UserAvatar } from "@/components/layout/user-avatar";
import { TogglePill } from "@/components/search/filter-pill";
import { ListStatus } from "@/components/seminar/list-status";
import { SeminarCard } from "@/components/seminar/seminar-card";
import { SeminarListItem } from "@/components/seminar/seminar-list-item";
import { SeminarCardSkeleton, SeminarListItemSkeleton, SkeletonList } from "@/components/seminar/seminar-skeleton";
import { useLogoutMutation } from "@/hooks/mutations/user/useLogoutMutation";
import { useBookmarksQuery } from "@/hooks/queries/bookmark/useBookmarksQuery";
import { useUserQuery } from "@/hooks/queries/user/useUserQuery";
import { useSession } from "@/hooks/useSession";
import type { Seminar } from "@/lib/seminars";
import { cn } from "@/lib/utils";

const providerLabels: Record<string, string> = {
  google: "Google 계정",
  kakao: "카카오 계정",
  email: "이메일 계정",
};

const tabs = [
  { value: "all", label: "전체", match: () => true },
  { value: "soon", label: "마감 임박", match: (s: Seminar) => s.closingSoon },
  { value: "ce", label: "보수교육", match: (s: Seminar) => s.ceRecognized || s.credit !== null },
] as const;

export function MyPage() {
  const session = useSession();
  const { data: user } = useUserQuery(Boolean(session));
  const bookmarks = useBookmarksQuery(Boolean(session));
  const logout = useLogoutMutation();

  if (session === undefined) return <MyPageSkeleton />;
  if (session === null) return <LoginRequired />;

  const name = user?.name ?? session.user.email?.split("@")[0] ?? "회원";
  const email = user?.email ?? session.user.email ?? null;
  const provider = user?.provider ?? session.user.app_metadata.provider ?? null;
  const items = bookmarks.data ?? [];

  const menu = [
    { label: "저장한 세미나", icon: Bookmark, href: "#saved", badge: String(items.length) },
    { label: "알림 조건", icon: Bell, href: "/alerts", badge: "준비 중" },
    { label: "수강 후기", icon: MessageSquareText, href: "/reviews", badge: "준비 중" },
  ];

  return (
    <Container className="pt-5 pb-10 md:pt-11 md:pb-0">
      <h1 className="hidden text-[30px] font-extrabold tracking-[-0.045em] md:block">마이페이지</h1>

      <div className="md:mt-7 md:grid md:grid-cols-[296px_minmax(0,1fr)] md:items-start md:gap-10">
        {/* 프로필 + 메뉴 */}
        <aside className="md:sticky md:top-6 md:rounded-[20px] md:border md:border-[#EFEFEF] md:p-6">
          <div className="flex items-center gap-4 md:flex-col md:items-start">
            <UserAvatar name={name} src={user?.avatarUrl} className="size-14 text-xl md:size-16 md:text-2xl" />
            <div className="min-w-0">
              <p className="truncate text-[19px] font-extrabold tracking-[-0.04em] md:text-[21px]">{name}님</p>
              {email && <p className="mt-0.5 truncate text-[13.5px] text-sub">{email}</p>}
              {provider && (
                <span className="mt-2 inline-flex h-6 items-center rounded-full bg-surface px-2.5 text-[12px] font-semibold text-[#555]">
                  {providerLabels[provider] ?? `${provider} 계정`}
                </span>
              )}
            </div>
          </div>

          <nav className="mt-6 hidden border-t border-line pt-3 md:block">
            {menu.map((item) => (
              <MenuLink key={item.label} {...item} />
            ))}
            <LogoutButton onClick={() => logout.mutate()} disabled={logout.isPending} />
          </nav>
        </aside>

        <div className="min-w-0">
          <Stats items={items} loading={bookmarks.status === "pending"} />
          <SavedSeminars status={bookmarks.status} items={items} />

          <AlertCta
            className="mt-10 md:mt-14"
            title="관심 조건으로 알림 받기"
            description="저장한 세미나와 비슷한 새 세미나가 올라오면 알려드려요"
            mobileDescription="새 세미나가 올라오면 알려드려요"
            action="알림 조건 만들기"
          />

          {/* 모바일은 메뉴를 아래에 둔다 */}
          <nav className="mt-8 border-t border-line pt-2 md:hidden">
            {menu.slice(1).map((item) => (
              <MenuLink key={item.label} {...item} />
            ))}
            <LogoutButton onClick={() => logout.mutate()} disabled={logout.isPending} />
          </nav>
        </div>
      </div>
    </Container>
  );
}

function Stats({ items, loading }: { items: Seminar[]; loading: boolean }) {
  const stats = [
    { label: "저장한 세미나", value: items.length, className: "text-ink" },
    { label: "마감 임박", value: items.filter(tabs[1].match).length, className: "text-soon" },
    { label: "보수교육", value: items.filter(tabs[2].match).length, className: "text-brand" },
  ];
  return (
    <div className="mt-6 grid grid-cols-3 gap-2.5 md:mt-0 md:gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-[14px] bg-surface px-3.5 py-3.5 md:rounded-[18px] md:px-6 md:py-5">
          <p className="text-[12.5px] font-semibold text-sub md:text-sm">{stat.label}</p>
          {loading ? (
            <div className="skeleton mt-2 h-7 w-10 rounded bg-white/70 md:h-8" />
          ) : (
            <p className={cn("mt-1 text-[22px] font-extrabold tracking-[-0.04em] md:text-[28px]", stat.className)}>
              {stat.value}
              <span className="ml-0.5 text-[13px] font-bold text-sub md:text-[15px]">개</span>
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function SavedSeminars({ status, items }: { status: "pending" | "error" | "success"; items: Seminar[] }) {
  const [tab, setTab] = useState<(typeof tabs)[number]["value"]>("all");
  const visible = items.filter(tabs.find((t) => t.value === tab)!.match);

  return (
    <section id="saved" className="mt-9 scroll-mt-6 md:mt-12">
      <div className="flex items-center justify-between pb-4 md:pb-5">
        <h2 className="text-xl font-extrabold tracking-[-0.04em] md:text-2xl">저장한 세미나</h2>
        <Link href="/search" className="text-[13px] font-semibold text-sub hover:text-ink">
          더 찾아보기 ›
        </Link>
      </div>
      <div className="flex gap-[7px] md:gap-2">
        {tabs.map((t) => (
          <TogglePill key={t.value} label={t.label} on={tab === t.value} onClick={() => setTab(t.value)} />
        ))}
      </div>

      {status === "pending" ? (
        <>
          <div className="mt-7 hidden grid-cols-3 gap-x-6 gap-y-10 md:grid">
            <SkeletonList count={3} render={(index) => <SeminarCardSkeleton key={index} />} />
          </div>
          <div className="mt-2 md:hidden">
            <SkeletonList count={3} render={(index) => <SeminarListItemSkeleton key={index} />} />
          </div>
        </>
      ) : status === "error" ? (
        <ListStatus status="error" empty="" />
      ) : visible.length === 0 ? (
        <EmptySaved filtered={items.length > 0} />
      ) : (
        <>
          <div className="mt-7 hidden grid-cols-3 gap-x-6 gap-y-10 md:grid">
            {visible.map((seminar) => (
              <SeminarCard key={seminar.id} seminar={seminar} />
            ))}
          </div>
          <div className="mt-2 md:hidden">
            {visible.map((seminar) => (
              <SeminarListItem key={seminar.id} seminar={seminar} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function EmptySaved({ filtered }: { filtered: boolean }) {
  return (
    <div className="mt-5 flex flex-col items-center rounded-[20px] border border-dashed border-[#E4E4E4] px-6 py-14 text-center md:mt-7 md:py-16">
      <span className="flex size-12 items-center justify-center rounded-full bg-surface">
        <Bookmark size={20} strokeWidth={2} />
      </span>
      <p className="mt-4 text-base font-bold">{filtered ? "이 조건의 저장한 세미나가 없어요" : "아직 저장한 세미나가 없어요"}</p>
      <p className="mt-1.5 text-[13.5px] text-sub">세미나 카드의 북마크 버튼을 누르면 여기에 모아둘게요</p>
      {!filtered && (
        <Link
          href="/search"
          className="mt-5 inline-flex h-10 items-center rounded-full bg-ink px-5 text-sm font-bold text-white"
        >
          세미나 둘러보기
        </Link>
      )}
    </div>
  );
}

function MenuLink({ label, icon: Icon, href, badge }: { label: string; icon: typeof Bell; href: string; badge: string }) {
  return (
    <Link
      href={href}
      className="flex h-12 items-center gap-3 rounded-[10px] text-[15px] font-semibold text-ink md:-mx-2 md:px-2 md:hover:bg-surface"
    >
      <Icon size={18} strokeWidth={1.9} className="text-[#555]" />
      <span className="flex-1">{label}</span>
      <span className="text-[12.5px] font-medium text-faint">{badge}</span>
      <ChevronRight size={16} className="text-faint" />
    </Link>
  );
}

function LogoutButton({ onClick, disabled }: { onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-12 w-full items-center gap-3 rounded-[10px] text-[15px] font-semibold text-sub md:-mx-2 md:w-[calc(100%+16px)] md:px-2 md:hover:bg-surface"
    >
      <LogOut size={18} strokeWidth={1.9} />
      로그아웃
    </button>
  );
}

function LoginRequired() {
  return (
    <Container className="flex justify-center py-20 md:py-28">
      <div className="w-full max-w-[380px] text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-surface">
          <Bookmark size={22} strokeWidth={2} />
        </span>
        <h1 className="mt-6 text-2xl font-extrabold tracking-[-0.04em]">로그인이 필요해요</h1>
        <p className="mt-2 text-[15px] leading-[1.55] text-sub">
          로그인하면 관심 세미나를 저장하고
          <br />
          마감 전에 다시 확인할 수 있어요
        </p>
        <div className="mt-8 flex flex-col gap-2">
          <Link href="/login" className="flex h-12 items-center justify-center rounded-full bg-ink text-[15px] font-bold text-white">
            로그인
          </Link>
          <Link
            href="/signup"
            className="flex h-12 items-center justify-center rounded-full border border-[#E4E4E4] text-[15px] font-bold text-ink"
          >
            회원가입
          </Link>
        </div>
      </div>
    </Container>
  );
}

function MyPageSkeleton() {
  return (
    <Container className="pt-5 md:pt-11" aria-busy>
      <div className="skeleton hidden h-9 w-40 rounded-lg md:block" />
      <div className="md:mt-7 md:grid md:grid-cols-[296px_minmax(0,1fr)] md:gap-10">
        <div className="skeleton h-[88px] rounded-[20px] md:h-[360px]" />
        <div>
          <div className="mt-6 grid grid-cols-3 gap-2.5 md:mt-0 md:gap-4">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="skeleton h-[78px] rounded-[14px] md:h-[100px] md:rounded-[18px]" />
            ))}
          </div>
          <div className="mt-12 hidden grid-cols-3 gap-6 md:grid">
            <SkeletonList count={3} render={(index) => <SeminarCardSkeleton key={index} />} />
          </div>
        </div>
      </div>
    </Container>
  );
}
