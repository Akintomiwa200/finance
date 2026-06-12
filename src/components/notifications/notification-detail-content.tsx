"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/src/components/layout/page-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { useNotificationStore } from "@/src/store/notification-store";
import {
  formatNotificationTime,
  getSeverityBadgeVariant,
} from "@/src/components/notifications/notification-utils";
import { NOTIFICATION_TABS } from "@/src/types/notification";
import { formatDate } from "@/src/lib/utils";
import { NotificationDetailSkeleton } from "@/src/components/layout/dashboard-skeletons";

interface NotificationDetailContentProps {
  scope: "dashboard" | "admin";
  id: string;
}

export function NotificationDetailContent({ scope, id }: NotificationDetailContentProps) {
  const router = useRouter();
  const initNotifications = useNotificationStore((s) => s.initNotifications);
  const initialized = useNotificationStore((s) => s.initialized);
  const getById = useNotificationStore((s) => s.getById);
  const markAsRead = useNotificationStore((s) => s.markAsRead);

  const basePath = scope === "admin" ? "/admin/notifications" : "/notifications";

  useEffect(() => {
    initNotifications(scope);
  }, [initNotifications, scope]);

  const notification = getById(id);

  useEffect(() => {
    if (notification && !notification.isRead) {
      markAsRead(notification.id);
    }
  }, [notification, markAsRead]);

  if (!initialized) {
    return (
      <PageLayout title="Notification" showBack>
        <NotificationDetailSkeleton />
      </PageLayout>
    );
  }

  if (!notification) {
    return (
      <PageLayout
        title="Notification not found"
        description="This notification may have been removed or does not exist."
        showBack
        breadcrumbs={[
          { label: "Notifications", href: basePath },
          { label: "Not found" },
        ]}
      >
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">
              We could not find a notification with ID &ldquo;{id}&rdquo;.
            </p>
            <Button variant="outline" onClick={() => router.push(basePath)}>
              Back to notifications
            </Button>
          </CardContent>
        </Card>
      </PageLayout>
    );
  }

  const categoryLabel =
    NOTIFICATION_TABS.find((t) => t.value === notification.category)?.label ??
    notification.category;

  return (
    <PageLayout
      title={notification.title}
      showBack
      breadcrumbs={[
        { label: "Notifications", href: basePath },
        { label: notification.title },
      ]}
    >
      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={getSeverityBadgeVariant(notification.type)}>
              {notification.type}
            </Badge>
            <Badge variant="secondary">{categoryLabel}</Badge>
            {!notification.isRead && (
              <Badge variant="info">Unread</Badge>
            )}
          </div>
          <CardTitle className="text-xl pt-2">{notification.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {formatDate(notification.createdAt, "long")} ·{" "}
            {formatNotificationTime(notification.createdAt)}
          </p>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <p className="text-sm text-foreground leading-relaxed">
            {notification.body ?? notification.message}
          </p>
          {notification.referenceId && (
            <div className="rounded-lg border border-border bg-muted/40 px-4 py-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Reference
              </p>
              <p className="text-sm font-mono mt-1">{notification.referenceId}</p>
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => router.push(basePath)}>
              Back to all notifications
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
