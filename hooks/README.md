# hooks

서버 데이터는 TanStack Query 로 관리하고, 요청 종류에 따라 폴더를 나눈다.

```
hooks/
├── queries/            # GET (조회) → useQuery
│   └── <도메인>/
│       └── useXxxQuery.ts
└── mutations/          # POST · PUT · PATCH · DELETE (변경) → useMutation
    └── <도메인>/
        └── useXxxMutation.ts
```

- 도메인 폴더는 API 이름에 맞춘다. 예: `user`, `seminar`, `review`
- 파일 하나에 훅 하나, 파일명과 훅 이름을 같게 한다.

예시

- `hooks/mutations/user/useLoginMutation.ts` — 로그인 (POST)
- `hooks/queries/user/useUserQuery.ts` — 내 정보 조회 (GET)

```ts
// hooks/queries/user/useUserQuery.ts
import { useQuery } from "@tanstack/react-query";

export function useUserQuery() {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: () => fetch("/api/user/me").then((res) => res.json()),
  });
}
```

```ts
// hooks/mutations/user/useLoginMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: { email: string; password: string }) =>
      fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((res) => res.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
  });
}
```

QueryClient 설정은 `lib/query-client.ts`, Provider 는 `components/providers/query-provider.tsx` 에 있다.
