// 이용약관·개인정보처리방침 본문 구조. 페이지는 이 데이터를 그대로 그린다.
// 본문 안의 【…】는 운영자가 채워야 하는 빈칸이라 화면에서 강조해 보여준다
export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] };

export type LegalSection = {
  id: string;
  heading: string;
  blocks: LegalBlock[];
};

export type LegalDocument = {
  title: string;
  // 시행일. 비어 있으면 빈칸으로 보여준다
  effectiveDate: string;
  intro: string[];
  sections: LegalSection[];
};
