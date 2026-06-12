"use client";

import { use } from "react";
import { AuditLogDetailPageContent } from "@/src/components/admin/audit-log-detail-page-content";

export default function AuditLogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <AuditLogDetailPageContent id={id} />;
}
