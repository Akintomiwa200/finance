"use client";

import { use } from "react";
import { AdminSupportTicketDetailPageContent } from "@/src/components/admin/admin-support-ticket-detail-page-content";

export default function AdminTicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <AdminSupportTicketDetailPageContent id={id} />;
}
