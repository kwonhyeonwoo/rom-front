import { isServer, QueryClient } from "@tanstack/react-query";

import { ApiError } from "@/lib/api";

// 서버(Render 무료 플랜)가 잠들어 있다 깨어나는 동안에는 연결이 끊기거나 502·503이 온다.
// 이런 일시적인 실패만 간격을 늘려가며 다시 시도하고, 400·401·404처럼 다시 해도 같은 오류는 바로 보여준다.
const MAX_RETRIES = 4;

function isTransient(error: unknown) {
  if (!(error instanceof ApiError)) return true; // fetch 자체가 실패(네트워크 끊김, 서버 깨어나는 중)
  return error.status >= 500 || error.status === 408 || error.status === 429;
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // SSR 직후 클라이언트에서 바로 다시 요청하지 않도록 기본 staleTime 을 둔다.
        staleTime: 60 * 1000,
        retry: (failureCount, error) => failureCount < MAX_RETRIES && isTransient(error),
        // 2초, 4초, 8초, 15초. 서버가 깨어나는 데 걸리는 30초 남짓을 버틴다
        retryDelay: (attempt) => Math.min(2000 * 2 ** attempt, 15_000),
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

// 서버에서는 요청마다 새 QueryClient, 브라우저에서는 하나를 재사용한다.
export function getQueryClient() {
  if (isServer) return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
