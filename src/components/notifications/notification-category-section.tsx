"use client";

import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { cn } from "@/src/lib/utils";
import type { AppNotification } from "@/src/types/notification";
import {
  formatNotificationTime,
  getSeverityBadgeVariant,
} from "@/src/components/notifications/notification-utils";

interface NotificationCategorySectionProps {
  label: string;
  icon: LucideIcon;
  notifications: AppNotification[];
  onSelect: (notification: AppNotification) => void;
  emptyMessage?: string;
}

export function NotificationCategorySection({
  label,
  icon: Icon,
  notifications,
  onSelect,
  emptyMessage = "No notifications in this category",
}: NotificationCategorySectionProps) {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Card className="flex flex-col">
      <CardHeader className="border-b border-border pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </span>
            {label}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="tabular-nums">
              {notifications.length}
            </Badge>
            {unreadCount > 0 && (
              <Badge variant="danger" className="tabular-nums">
                {unreadCount} unread
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        {notifications.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {notifications.map((notification) => (
              <li key={notification.id}>
                <button
                  type="button"
                  onClick={() => onSelect(notification)}
                  className={cn(
                    "group flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/50",
                    !notification.isRead && "bg-muted/20",
                  )}
                >
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={getSeverityBadgeVariant(notification.type)}
                        className="text-[10px] uppercase tracking-wide"
                      >
                        {notification.type}
                      </Badge>
                      {!notification.isRead && (
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                      )}
                    </div>
                    <p
                      className={cn(
                        "text-sm leading-snug",
                        notification.isRead
                          ? "font-medium text-foreground/80"
                          : "font-semibold text-foreground",
                      )}
                    >
                      {notification.title}
                    </p>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground/80">
                      {formatNotificationTime(notification.createdAt)}
                    </p>
                  </div>
                  <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
