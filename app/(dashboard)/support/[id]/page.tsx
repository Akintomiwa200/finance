"use client";

import { use } from "react";
import { TenantSupportTicketDetailPageContent } from "@/src/components/support/tenant-support-ticket-detail-page-content";

export default function SupportTicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <TenantSupportTicketDetailPageContent id={id} />;
}
