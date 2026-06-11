"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, ArrowRight } from "lucide-react";
import { useNotificationStore } from "@/src/store/notification-store";
import { NotificationTimeline } from "@/src/components/notifications/notification-timeline";
import { cn } from "@/src/lib/utils";
import {
  NOTIFICATION_TABS,
  type AppNotification,
  type NotificationCategory,
} from "@/src/types/notification";

interface NotificationDropdownProps {
  scope: "dashboard" | "admin";
  onClose: () => void;
}

export function NotificationDropdown({
  scope,
  onClose,
}: NotificationDropdownProps) {
  const router = useRouter();
  const notifications = useNotificationStore((s) => s.notifications);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);

  const [activeTab, setActiveTab] = useState<NotificationCategory>("messages");

  const basePath =
    scope === "admin" ? "/admin/notifications" : "/notifications";

  const unreadByCategory = useMemo(() => {
    const counts: Record<NotificationCategory, number> = {
      messages: 0,
      events: 0,
      system_errors: 0,
    };
    for (const n of notifications) {
      if (!n.isRead) counts[n.category] += 1;
    }
    return counts;
  }, [notifications]);

  const tabNotifications = useMemo(
    () =>
      notifications
        .filter((n) => n.category === activeTab)
        .slice(0, 8),
    [notifications, activeTab],
  );

  function handleSelect(notification: AppNotification) {
    if (!notification.isRead) markAsRead(notification.id);
    onClose();
    router.push(`${basePath}/${notification.id}`);
  }

  function handleViewAll() {
    onClose();
    router.push(basePath);
  }

  return (
    <div
      className="absolute right-0 top-full z-50 mt-2.5 w-[min(100vw-1.5rem,22rem)] origin-top-right animate-in fade-in-0 zoom-in-95 duration-200 overflow-hidden rounded-2xl border border-border/80 bg-card/95 shadow-2xl shadow-black/10 backdrop-blur-xl dark:shadow-black/40"
      role="dialog"
      aria-label="Notifications"
    >
      {/* Header */}
      <div className="relative overflow-hidden px-4 pb-4 pt-4">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/90 via-indigo-500/85 to-sky-500/80"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.25),transparent_50%)]" aria-hidden />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                <Bell className="h-4 w-4" />
              </span>
              <h2 className="text-[15px] font-semibold tracking-tight">Notifications</h2>
            </div>
            <p className="mt-1.5 text-xs text-white/80">
              {unreadCount > 0 ? (
                <>
                  You have{" "}
                  <span className="font-semibold text-white">{unreadCount}</span> unread
                </>
              ) : (
                "You're all caught up"
              )}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="flex shrink-0 items-center gap-1 rounded-lg bg-white/15 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25"
              title="Mark all as read"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border bg-muted/30 px-2">
        <div className="flex gap-0.5" role="tablist">
          {NOTIFICATION_TABS.map((tab) => {
            const count = unreadByCategory[tab.value];
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "relative flex flex-1 items-center justify-center gap-1.5 rounded-t-lg px-2 py-2.5 text-[11px] font-medium transition-colors",
                  isActive
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="truncate">{tab.label}</span>
                {count > 0 && (
                  <span
                    className={cn(
                      "flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold",
                      isActive
                        ? "bg-brand-600 text-white"
                        : "bg-muted-foreground/15 text-muted-foreground",
                    )}
                  >
                    {count > 9 ? "9+" : count}
                  </span>
                )}
                {isActive && (
                  <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <div className="max-h-[min(55vh,20rem)] overflow-y-auto overscroll-contain">
        <NotificationTimeline
          notifications={tabNotifications}
          onSelect={handleSelect}
          compact
          emptyMessage={`No ${NOTIFICATION_TABS.find((t) => t.value === activeTab)?.label.toLowerCase()} yet`}
        />
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-muted/20 p-2.5">
        <button
          type="button"
          onClick={handleViewAll}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          View all notifications
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}
