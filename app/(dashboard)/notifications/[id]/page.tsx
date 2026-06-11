"use client";

import { use } from "react";
import { NotificationDetailContent } from "@/src/components/notifications/notification-detail-content";

export default function NotificationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <NotificationDetailContent scope="dashboard" id={id} />;
}
