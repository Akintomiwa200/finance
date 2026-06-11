"use client";

import { cn } from "@/src/lib/utils";
import type { AppNotification } from "@/src/types/notification";
import {
  formatNotificationTime,
  getSeverityDotColor,
} from "@/src/components/notifications/notification-utils";
import { Bell } from "lucide-react";

interface NotificationTimelineProps {
  notifications: AppNotification[];
  onSelect: (notification: AppNotification) => void;
  compact?: boolean;
  emptyMessage?: string;
}

export function NotificationTimeline({
  notifications,
  onSelect,
  compact = false,
  emptyMessage = "No notifications in this category",
}: NotificationTimelineProps) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-10 text-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <Bell className="h-4 w-4 text-muted-foreground" />
        </span>
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="relative px-2 py-2">
      <div
        className={cn(
          "absolute left-[19px] top-3 bottom-3 w-px bg-border/80",
          compact && "left-[17px]",
        )}
        aria-hidden
      />
      <ul className="space-y-0.5">
        {notifications.map((notification) => (
          <li key={notification.id}>
            <button
              type="button"
              onClick={() => onSelect(notification)}
              className={cn(
                "group relative flex w-full gap-3 rounded-xl text-left transition-all hover:bg-muted/70",
                compact ? "px-2.5 py-2.5" : "px-3 py-3",
                !notification.isRead && "bg-brand-50/50 dark:bg-brand-950/20",
              )}
            >
              <span
                className={cn(
                  "relative z-[1] mt-2 shrink-0 rounded-full ring-[3px] ring-card",
                  compact ? "h-2 w-2" : "h-2.5 w-2.5",
                  getSeverityDotColor(notification.type),
                  !notification.isRead && "ring-brand-100 dark:ring-brand-900/40",
                )}
                aria-hidden
              />
              <div className="min-w-0 flex-1 pr-1">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={cn(
                      "text-[13px] leading-snug",
                      notification.isRead
                        ? "font-medium text-foreground/75"
                        : "font-semibold text-foreground",
                    )}
                  >
                    {notification.title}
                  </p>
                  {!notification.isRead && (
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                  )}
                </div>
                {notification.message && (
                  <p
                    className={cn(
                      "mt-0.5 text-muted-foreground line-clamp-2",
                      compact ? "text-[11px] leading-relaxed" : "text-xs",
                    )}
                  >
                    {notification.message}
                  </p>
                )}
                <p className="mt-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70">
                  {formatNotificationTime(notification.createdAt)}
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
