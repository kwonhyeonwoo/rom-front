import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/legal/legal-document";
import { privacyPolicy } from "@/lib/legal/privacy";

export const metadata: Metadata = {
  title: "개인정보처리방침",
};

export default function PrivacyPage() {
  return <LegalDocumentPage doc={privacyPolicy} />;
}
