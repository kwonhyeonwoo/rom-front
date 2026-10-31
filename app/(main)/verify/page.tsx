import type { Metadata } from "next";

import { SiteHeader } from "@/components/layout/site-header";
import { VerifyForm } from "@/components/verification/verify-form";

export const metadata: Metadata = {
  title: "면허 인증 · 롬",
};

export default function VerifyRoute() {
  return (
    <>
      <SiteHeader activeHref="/community" />
      <main>
        <VerifyForm />
      </main>
    </>
  );
}
