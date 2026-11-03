import { redirect } from "next/navigation";

// 광고·제휴 문의는 고객센터 1:1 문의의 '광고·제휴' 유형으로 받는다
export default function ContactPage() {
  redirect("/help?tab=inquiry&type=PARTNER");
}
