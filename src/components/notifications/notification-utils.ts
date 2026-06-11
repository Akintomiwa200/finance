import type { NotificationSeverity } from "@/src/types/notification";

export function getSeverityDotColor(type: NotificationSeverity): string {
  switch (type) {
    case "SUCCESS":
      return "bg-emerald-500";
    case "WARNING":
      return "bg-amber-500";
    case "ERROR":
      return "bg-red-500";
    default:
      return "bg-blue-500";
  }
}

export function getSeverityBadgeVariant(
  type: NotificationSeverity,
): "success" | "warning" | "danger" | "info" {
  switch (type) {
    case "SUCCESS":
      return "success";
    case "WARNING":
      return "warning";
    case "ERROR":
      return "danger";
    default:
      return "info";
  }
}

export function formatNotificationTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
