export type NotificationCategory = "messages" | "events" | "system_errors";

export type NotificationSeverity = "INFO" | "SUCCESS" | "WARNING" | "ERROR";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  body?: string;
  category: NotificationCategory;
  type: NotificationSeverity;
  isRead: boolean;
  createdAt: string;
  referenceId?: string;
}

export const NOTIFICATION_TABS: {
  value: NotificationCategory;
  label: string;
}[] = [
  { value: "messages", label: "Messages" },
  { value: "events", label: "Events" },
  { value: "system_errors", label: "System Errors" },
];
