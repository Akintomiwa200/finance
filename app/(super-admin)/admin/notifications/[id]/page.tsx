"use client";

import { use } from "react";
import { NotificationDetailContent } from "@/src/components/notifications/notification-detail-content";

export default function AdminNotificationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <NotificationDetailContent scope="admin" id={id} />;
}
