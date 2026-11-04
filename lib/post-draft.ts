import type { PostImage } from "@/components/community/post-editor";
import type { Board } from "@/lib/community";

// 글쓰기 임시저장. 이 브라우저에만 회원별로 남는다 (등록하면 지운다)
export type PostDraft = {
  board: Board;
  seminarId: string | null;
  fields: string[];
  title: string;
  content: string;
  images: PostImage[];
  anonymous: boolean;
  savedAt: number;
};

const key = (userId: string) => `rom:post-draft:${userId}`;

export function loadDraft(userId: string): PostDraft | null {
  try {
    const raw = localStorage.getItem(key(userId));
    if (!raw) return null;
    const draft = JSON.parse(raw) as PostDraft;
    return draft.title || draft.content || draft.images?.length ? draft : null;
  } catch {
    return null;
  }
}

export function saveDraft(userId: string, draft: PostDraft) {
  try {
    localStorage.setItem(key(userId), JSON.stringify(draft));
    return true;
  } catch {
    return false;
  }
}

export function clearDraft(userId: string) {
  try {
    localStorage.removeItem(key(userId));
  } catch {
    // 저장소를 못 쓰는 브라우저면 지울 것도 없다
  }
}

// "11:42"
export function formatSavedAt(at: number) {
  const d = new Date(at);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
