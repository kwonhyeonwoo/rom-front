import { useMutation, useQueryClient } from "@tanstack/react-query";

import { adminFetch } from "@/lib/admin-api";
import type { AdminReportDetail, ReportTarget, Sanction } from "@/lib/report";

type Action =
  | { action: "hide"; sanction: Sanction; note?: string }
  | { action: "dismiss"; note?: string }
  | { action: "restore" };

// 신고 처리 (rom-back POST /admin/reports/:type/:id/hide|dismiss|restore). 처리하면 목록·상세·배지를 새로 받는다
export function useReportActionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, id, ...body }: { type: ReportTarget; id: string } & Action) =>
      adminFetch<AdminReportDetail>(`/admin/reports/${type}/${encodeURIComponent(id)}/${body.action}`, {
        method: "POST",
        body: JSON.stringify(
          body.action === "hide"
            ? { sanction: body.sanction, ...(body.note ? { note: body.note } : {}) }
            : body.action === "dismiss" && body.note
              ? { note: body.note }
              : {},
        ),
      }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["admin"] }),
  });
}
