"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Calendar, CheckCheck, MessageSquare } from "lucide-react";
import { PageLayout } from "@/src/components/layout/page-layout";
import {
  Card,
  CardContent,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { NotificationCategorySection } from "@/src/components/notifications/notification-category-section";
import { useNotificationStore } from "@/src/store/notification-store";
import {
  NOTIFICATION_TABS,
  type NotificationCategory,
} from "@/src/types/notification";
import { cn } from "@/src/lib/utils";

const CATEGORY_ICONS = {
  messages: MessageSquare,
  events: Calendar,
  system_errors: AlertTriangle,
} as const;

type PageFilter = "all" | NotificationCategory;

interface NotificationsPageContentProps {
  scope: "dashboard" | "admin";
}

export function NotificationsPageContent({ scope }: NotificationsPageContentProps) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<PageFilter>("all");
  const initNotifications = useNotificationStore((s) => s.initNotifications);
  const notifications = useNotificationStore((s) => s.notifications);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);

  const basePath = scope === "admin" ? "/admin/notifications" : "/notifications";

  useEffect(() => {
    initNotifications(scope);
  }, [initNotifications, scope]);

  const tabUnread = (category: NotificationCategory) =>
    notifications.filter((n) => n.category === category && !n.isRead).length;

  const grouped = useMemo(() => {
    const groups = {} as Record<NotificationCategory, typeof notifications>;
    for (const tab of NOTIFICATION_TABS) {
      groups[tab.value] = notifications
        .filter((n) => n.category === tab.value)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }
    return groups;
  }, [notifications]);

  const visibleTabs =
    activeFilter === "all"
      ? NOTIFICATION_TABS
      : NOTIFICATION_TABS.filter((tab) => tab.value === activeFilter);

  function handleSelect(notification: (typeof notifications)[number]) {
    if (!notification.isRead) markAsRead(notification.id);
    router.push(`${basePath}/${notification.id}`);
  }

  return (
    <PageLayout
      title="Notifications"
      description="Stay up to date with messages, events, and system alerts"
      actions={
        unreadCount > 0 ? (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </Button>
        ) : undefined
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Unread</p>
            <p className="text-2xl font-bold">{unreadCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{notifications.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">System errors</p>
            <p className="text-2xl font-bold">{tabUnread("system_errors")}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setActiveFilter("all")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
            activeFilter === "all"
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
          )}
        >
          All categories
          {unreadCount > 0 && (
            <Badge variant="danger" className="h-5 min-w-5 justify-center px-1.5 text-[10px]">
              {unreadCount}
            </Badge>
          )}
        </button>
        {NOTIFICATION_TABS.map((tab) => {
          const count = tabUnread(tab.value);
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveFilter(tab.value)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                activeFilter === tab.value
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
            >
              {tab.label}
              {count > 0 && (
                <Badge variant="danger" className="h-5 min-w-5 justify-center px-1.5 text-[10px]">
                  {count}
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      <div
        className={cn(
          "grid gap-4",
          activeFilter === "all" ? "lg:grid-cols-3" : "max-w-3xl",
        )}
      >
        {visibleTabs.map((tab) => (
          <NotificationCategorySection
            key={tab.value}
            label={tab.label}
            icon={CATEGORY_ICONS[tab.value]}
            notifications={grouped[tab.value]}
            onSelect={handleSelect}
            emptyMessage={`No ${tab.label.toLowerCase()} to show`}
          />
        ))}
      </div>
    </PageLayout>
  );
}
