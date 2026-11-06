import { cacheLife, cacheTag } from "next/cache";

import type { ApiSeminar, SeminarPage } from "@/lib/seminars";

// 서버(검색엔진이 받는 HTML)에서 세미나를 읽는 함수.
// 브라우저용 apiFetch는 Supabase 세션을 읽어서 서버에서 쓸 수 없고, 세미나 조회는 로그인이 필요 없어 그냥 fetch한다.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// Render 무료 서버는 잠들어 있으면 깨어나는 데 수십 초 걸린다
const TIMEOUT_MS = 50_000;

async function getJson<T>(path: string): Promise<T | null> {
  const res = await fetch(`${API_URL}${path}`, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (res.status === 404 || res.status === 400) return null;
  // 서버 오류는 던져서 캐시에 남기지 않는다 (빈 결과가 몇 시간 동안 굳어 버리지 않게)
  if (!res.ok) throw new Error(`rom-back ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

export async function getSeminar(id: string): Promise<ApiSeminar | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("seminars", `seminar-${id}`);
  // id에 경로 문자가 섞여 다른 API를 부르는 일을 막는다
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(id)) return null;
  return getJson<ApiSeminar>(`/seminars/${id}`);
}

// sitemap.xml용: 아직 끝나지 않은 세미나 전체 (API는 한 번에 50건까지 준다)
const SITEMAP_PAGE_SIZE = 50;
const SITEMAP_MAX_PAGES = 40;

export async function getSeminarsForSitemap(): Promise<ApiSeminar[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("seminars");
  const all: ApiSeminar[] = [];
  for (let page = 1; page <= SITEMAP_MAX_PAGES; page++) {
    const data = await getJson<SeminarPage>(`/seminars?sort=latest&limit=${SITEMAP_PAGE_SIZE}&page=${page}`);
    if (!data) break;
    all.push(...data.items);
    if (data.items.length < SITEMAP_PAGE_SIZE || all.length >= data.total) break;
  }
  return all;
}
