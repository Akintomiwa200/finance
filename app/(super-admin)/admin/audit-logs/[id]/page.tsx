"use client";

import { use } from "react";
import { PageLayout } from "@/src/components/layout/page-layout";
import { Card, CardContent } from "@/src/components/ui/card";
import { useFetch } from "@/src/hooks/use-fetch";
import { formatDate } from "@/src/lib/utils";

interface AuditDetail {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: unknown;
  userName: string | null;
  ipAddress: string | null;
  organization: { name: string } | null;
  createdAt: string;
}

export default function AuditLogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: log, isLoading } = useFetch<AuditDetail>(`/api/admin/audit-logs/${id}`);

  if (isLoading || !log) return <PageLayout title={isLoading ? "Loading..." : "Not found"} showBack />;

  return (
    <PageLayout
      title={`${log.action} — ${log.entity}`}
      description={formatDate(log.createdAt, "long")}
      showBack
      breadcrumbs={[{ label: "Audit Logs", href: "/admin/audit-logs" }, { label: log.action }]}
    >
      <Card>
        <CardContent className="pt-6 space-y-4 text-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><span className="text-muted-foreground block mb-1">Action</span>{log.action}</div>
            <div><span className="text-muted-foreground block mb-1">Entity</span><span className="font-mono">{log.entity}</span></div>
            <div><span className="text-muted-foreground block mb-1">Entity ID</span><span className="font-mono text-xs">{log.entityId ?? "—"}</span></div>
            <div><span className="text-muted-foreground block mb-1">User</span>{log.userName ?? "—"}</div>
            <div><span className="text-muted-foreground block mb-1">Company</span>{log.organization?.name ?? "—"}</div>
            <div><span className="text-muted-foreground block mb-1">IP Address</span>{log.ipAddress ?? "—"}</div>
          </div>
          {log.details != null && (
            <div>
              <span className="text-muted-foreground block mb-2">Details</span>
              <pre className="p-4 rounded-lg bg-muted text-xs overflow-x-auto">{JSON.stringify(log.details, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </PageLayout>
  );
}
