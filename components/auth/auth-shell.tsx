import { Logo } from "@/components/layout/logo";

// 헤더 없이 화면 가운데에 로고·제목·소셜 버튼을 두는 로그인/회원가입 공통 틀
export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 items-center justify-center bg-white px-5 py-10">
      <div className="w-full max-w-[380px] text-center">
        <Logo className="text-[40px]" />
        <h1 className="mt-7 text-2xl font-extrabold tracking-[-0.04em]">{title}</h1>
        <p className="mt-2 text-[15px] leading-[1.55] text-sub">{description}</p>
        <div className="mt-9">{children}</div>
        <div className="mt-9 border-t border-line pt-6 text-sm text-sub">{footer}</div>
      </div>
    </main>
  );
}
