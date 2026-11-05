import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/legal/legal-document";
import { termsOfService } from "@/lib/legal/terms";

export const metadata: Metadata = {
  title: "이용약관",
};

export default function TermsPage() {
  return <LegalDocumentPage doc={termsOfService} />;
}
