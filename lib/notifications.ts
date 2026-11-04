// rom-back 알림 API (/notifications) 응답 모델
// INQUIRY_ANSWER: 문의 답변, REPORT_RESULT: 내가 한 신고의 처리 결과, CONTENT_HIDDEN: 내 글·댓글이 신고로 숨겨짐
export type NotificationType = "INQUIRY_ANSWER" | "REPORT_RESULT" | "CONTENT_HIDDEN";

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  // 누르면 이동할 사이트 안 경로
  link: string;
  readAt: string | null;
  createdAt: string;
};

export type NotificationList = { items: AppNotification[]; unreadCount: number };

// "방금 전", "5분 전", "3시간 전", "2일 전", 일주일이 넘으면 날짜
export function timeAgo(iso: string, now = Date.now()) {
  const diff = Math.max(0, now - new Date(iso).getTime());
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;
  const kst = new Date(new Date(iso).getTime() + 9 * 3_600_000);
  return `${kst.getUTCMonth() + 1}.${kst.getUTCDate()}`;
}
